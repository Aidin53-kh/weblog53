import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../prisma/db';
import { withAuth } from '../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies['access_token'] as string;
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const user = await db.user.findUnique({
        where: {
            id: currentUser.id as string,
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

    if (!user) return res.status(404).json({ message: 'user not found' });
    res.status(200).json({ user });
};
