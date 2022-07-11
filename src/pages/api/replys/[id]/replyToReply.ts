import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const replyId = req.query.id as string;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    if ((await db.user.count({ where: { id: currentUser.id as string } })) === 0) {
        return res.status(401).json({ message: 'auth require' });
    }

    if ((await db.reply.count({ where: { id: replyId } })) === 0) {
        return res.status(404).json({ message: 'post not found' });
    }

    const reply = await db.reply.create({
        data: {
            ...req.body,
            authorId: currentUser.id as string,
            replyId,
        },
        include: {
            _count: true,
            likes: {
                select: {
                    id: true,
                },
            },
            author: {
                select: {
                    username: true,
                    avatar: true,
                    id: true,
                },
            },
        },
    });

    res.status(201).json({ reply });
};