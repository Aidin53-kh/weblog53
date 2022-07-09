import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../prisma/db';
import { withAuth } from '../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) {
        return res.status(401).json({ message: 'auth require' });
    }

    const unPublishedPosts = await db.post.findMany({
        where: {
            authorId: currentUser.id as string,
            isPublic: false,
        },
        select: {
            title: true,
            thumbnail: true,
            createdAt: true
        },
    });

    res.status(200).json({ posts: unPublishedPosts });
};
