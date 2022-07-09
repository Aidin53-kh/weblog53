import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const postId = req.query.postId as string;
    const user = await db.user.findUnique({
        where: { id: currentUser.id as string },
        select: {
            savedPosts: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!user) return res.status(401).json({ message: 'auth require' });

    if (user.savedPosts.some((post) => post.id === postId)) {
        console.log('unsave');
        const updatedUser = await db.user.update({
            where: { id: currentUser.id as string },
            data: {
                savedPosts: {
                    set: user.savedPosts.filter((savedPost) => savedPost.id !== postId),
                },
            },
            include: {
                _count: true,
                savedPosts: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        res.status(200).json({ user: updatedUser, isSave: false });
    } else {
        console.log('save');
        const updatedUser = await db.user.update({
            where: { id: currentUser.id as string },
            data: {
                savedPosts: {
                    set: [{ id: postId }, ...user.savedPosts],
                },
            },
            include: {
                _count: true,
                savedPosts: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        res.status(200).json({ user: updatedUser, isSave: true });
    }
};
