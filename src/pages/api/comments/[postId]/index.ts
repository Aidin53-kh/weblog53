import { Comment } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
var f: Comment;
export default async (req: NextApiRequest, res: NextApiResponse) => {
    // if (req.method !== 'GET') {
    //     return res.status(405).json({ message: 'method not allowed' });
    // }

    // const comments = await db.comment.findMany({
    //     where: {
    //         postId: req.query.postId as string,
    //     },
    //     orderBy: { 
    //         createdAt: 'desc' 
    //     },
    //     include: {
    //         _count: true,
    //         likes: {
    //             select: {
    //                 id: true,
    //             },
    //         },
    //         author: {
    //             select: {
    //                 username: true,
    //                 avatar: true,
    //                 id: true,
    //             },
    //         },
    //     },
    // });

    res.status(200).json({ comments: [] });
};
