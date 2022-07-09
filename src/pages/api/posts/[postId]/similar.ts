import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const post = await db.post.findUnique({
        where: { id: req.query.postId as string },
        select: {
            tags: true,
            id: true,
            authorId: true,
        },
    });

    if (!post) return res.status(404).json({ message: 'post not found' });

    const similarPosts = await db.post.findMany({
        where: {
            authorId: {
                not: post?.authorId,
            },
            tags: {
                hasEvery: post?.tags,
            },
            isPublic: true,
        },
        include: {
            author: {
                select: {
                    username: true,
                    avatar: true,
                    id: true,
                },
            },
        },
    });

    res.json({ posts: similarPosts });
};
