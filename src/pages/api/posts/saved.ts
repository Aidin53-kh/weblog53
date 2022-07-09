import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../prisma/db';
import { withAuth } from '../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) {
        return res.status(401).json({ message: 'auth require' });
    }

    const user = await db.user.findUnique({
        where: { id: currentUser.id as string },
        select: {
            savedPosts: {
                select: {
                    author: {
                        select: {
                            username: true,
                            avatar: true,
                            id: true
                        }
                    },
                    id: true,
                    title: true,
                    description: true,
                    thumbnail: true,
                    createdAt: true,
                    tags: true,
                    readingTime: true
                }
            }
        }
    });

    if (!user) {
        return res.status(401).json({ message: 'auth require' });
    }

    res.status(200).json({ posts: user.savedPosts })
};
