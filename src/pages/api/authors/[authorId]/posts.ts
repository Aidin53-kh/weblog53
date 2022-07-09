import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const authorId = req.query.authorId as string;

    if (req.method === 'GET') {
        const posts = await db.post.findMany({
            where: { authorId },
            include: { author: true }
        });

        return res.status(200).json({ posts });
    } else return res.status(405).json({ message: 'method not allowed' });
};
