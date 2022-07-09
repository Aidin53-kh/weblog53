import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { db } from '../../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, username, password, confirmPassword } = req.body;
    const regex = /^[a-zA-Z0-9_-]+$/;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    if ((await db.user.count({ where: { username } })) !== 0) {
        return res.status(409).json({ message: 'user already exist' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'password and confirm password is not match' });
    }

    if (!regex.test(username)) {
        return res.status(415).json({ message: 'User name Not Valid, please use carecters and numbers and "-, _"' });
    }

    const user = await db.user.create({
        data: {
            email,
            username,
            password,
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
