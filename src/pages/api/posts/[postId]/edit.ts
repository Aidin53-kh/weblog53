import { unlink } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const { oldImages, ...postData } = req.body;

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const templateWords = req.body.template.split(' ').length;
    const wpm = 200;
    const time = Math.ceil(templateWords / wpm);
    const tags = req.body.tags.map((tag: string) => tag.toString().toLowerCase().trim());

    const post = await db.post.findUnique({
        where: { id: req.query.postId as string },
        select: {
            authorId: true,
            images: true,
        },
    });

    if (!post) return res.status(404).json({ message: 'post not found' });

    if (post.authorId !== currentUser.id) {
        return res.status(403).json({ message: 'You are not allowed to edit this post' });
    }

    for (const imageName of post.images) {
        if (!oldImages.includes(imageName)) {
            unlink(`public/uploads/post/${imageName}`, (error) => {
                if (error) return console.log(error);
                console.log('unused image deleted: ' + imageName);
            });
        }
    }

    const updatedPost = await db.post.update({
        where: { id: req.query.postId as string },
        data: {
            ...postData,
            readingTime: time,
            tags,
        },
    });

    res.status(200).json(updatedPost);
};
