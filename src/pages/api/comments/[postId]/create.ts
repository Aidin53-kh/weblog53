import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // const postId = req.query.postId as string;
    
    // if (req.method !== 'POST') {
    //     return res.status(405).json({ message: 'method not allowed' });
    // }

    // const token = req.cookies['access_token'] as string;
    // const { isAuthentcate, currentUser } = withAuth(token);

    // if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    // if ((await db.user.count({ where: { id: currentUser.id as string } })) === 0) {
    //     return res.status(401).json({ message: 'auth require' });
    // }

    // if (await db.post.count({ where: { id: postId } }) === 0) {
    //     return res.status(404).json({ message: 'post not found' });
    // }

    // const comment = await db.comment.create({
    //     data: {
    //         ...req.body,
    //         postId,
    //         authorId: currentUser.id as string
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

    res.status(201).json({ comment: {} })
};
