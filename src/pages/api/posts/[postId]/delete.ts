import { unlink } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const postId = req.query.postId as string;
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const post = await db.post.findUnique({
        where: { id: postId },
        select: { 
            authorId: true, 
            images: true 
        },
    });

    if (!post) {
        return res.status(404).json({ message: 'post not found' });
    }

    if (post.authorId !== currentUser.id) {
        return res.status(403).json({ message: 'You are not allowed to delete this post' });
    }

    post.images.forEach(image => {
        unlink(`public/uploads/post/${image}`, error => {
            return error ? console.log(error) : console.log(`unused image (deleted): /post/${image}`);
        });
    });

    await db.post.delete({ where: { id: postId } });

    res.status(200).json({ message: 'post deleted successfully' });
};
