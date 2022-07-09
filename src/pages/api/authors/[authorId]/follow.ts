import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const authorId = req.query.authorId as string;

    const { currentUser, isAuthentcate } = withAuth(token);

    if (!isAuthentcate) {
        return res.status(401).json({ message: 'auth require' });
    }

    if (currentUser.id === authorId) {
        return res.status(400).json({ message: 'cannot follow your self' });
    }

    const existingRecord = await db.user.findUnique({
        where: { id: authorId },
        select: {
            followers: {
                select: { id: true },
            },
        },
    });

    if (!existingRecord) {
        return res.status(404).json({ message: 'user not found' });
    }

    const user = await db.user.update({
        where: { id: authorId },
        data: {
            followers: {
                set: [{ id: currentUser.id as string }, ...existingRecord.followers],
            },
        },
        include: {
            _count: {
                select: {
                    followers: true,
                },
            },
        },
    });

    res.status(200).json({ user });
};
