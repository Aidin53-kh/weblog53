import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const topAuthors = await db.user.findMany({
        take: 5,
        orderBy: { 
            followers: {
                _count: 'desc'
            }
        }
    });

    res.status(200).json({ authors: topAuthors });
};
