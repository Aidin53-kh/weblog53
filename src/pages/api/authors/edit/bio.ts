import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const user = await db.user.update({
        where: { id: currentUser.id as string },
        data: { bio: req.body.bio || null },
        include: {
            _count: true,
            savedPosts: {
                select: {
                    id: true,
                },
            },
        },
    });

    res.status(200).json({ message: 'user updataed', user });
};
