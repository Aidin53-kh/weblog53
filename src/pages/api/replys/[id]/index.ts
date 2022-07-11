import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    // const comment = await db.comment.findUnique({
    //     where: { id: req.query.commentId as string },
    //     select: {
    //         replys: {
    //             include: {
    //                 _count: true,
    //                 likes: {
    //                     select: {
    //                         id: true,
    //                     },
    //                 },
    //                 author: {
    //                     select: {
    //                         id: true,
    //                         username: true,
    //                         avatar: true,
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // });

    // if (!comment) return res.status(404).json({ message: 'comment not found' });

    res.status(200).json({ replys: [] });
};
