import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) {
        return res.status(401).json({ message: 'auth require' });
    }

    const targetUser = await db.user.findUnique({
        where: { id: req.query.authorId as string },
        select: {
            followers: {
                select: { id: true },
            },
        },
    });

    if (!targetUser) {
        return res.status(404).json({ message: 'user not found' });
    }

    const isFollowed = targetUser.followers.some((follower) => follower.id === currentUser.id);

    res.status(200).json({ isFollowed });
};
