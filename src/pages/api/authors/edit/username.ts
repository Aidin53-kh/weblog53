import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const newUsername = req.body.username;
    const accessToken = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(accessToken);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const newUsernameExist = await db.user.findUnique({
        where: { username: newUsername },
        select: { id: true },
    });

    if (newUsernameExist) return res.status(409).json({ message: 'username already exist' });

    const updatedUser = await db.user.update({
        where: { username: currentUser.username as string },
        data: { username: newUsername },
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
            username: updatedUser.username,
            id: updatedUser.id,
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

    res.status(200).json({ user: updatedUser });
}
