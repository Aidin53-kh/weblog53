import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { db } from '../../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const user = await db.user.findUnique({
        where: { username },
        include: {
            _count: true,
            savedPosts: {
                select: {
                    id: true
                }
            }
        },
    });

    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }

    if (user.password !== password) {
        return res.status(400).json({ message: 'invalid password' });
    }

    const token = jwt.sign(
        {
            username,
            id: user.id,
        },
        process.env.JWT_SECRET as string
    );

    res.setHeader(
        'Set-Cookie',
        serialize('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            path: '/',
        })
    );

    res.json({ user });
};
