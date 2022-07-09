import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';
import { unlink } from 'fs';

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads/avatar',
        filename: (_, file, cb) => {
            cb(null, `${randomUUID()}-${file.originalname}`);
        },
    }),
});

const api = createRouter<NextApiRequest & { file: Express.Multer.File }, NextApiResponse>();

// @ts-ignore
api.post(upload.single('avatar'), async (req, res) => {
    const avatar = req.file.filename;
    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const user = await db.user.findUnique({
        where: { id: currentUser.id as string },
        select: {
            avatar: true,
        },
    });

    if (!user) return res.status(404).json({ message: 'user not found' });

    if (user.avatar) {
        unlink(`public/uploads/avatar/${user.avatar}`, (error) => {
            if (error) return console.log(error);
            console.log('old avatar (deleted): ', user.avatar);
        });
    }

    const updatedUser = await db.user.update({
        where: { id: currentUser.id as string },
        data: { avatar },
        include: {
            _count: true,
        },
    });

    res.status(200).json({ user: updatedUser });
});

api.delete(async (req, res) => {
    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const updatedUser = await db.user.update({
        where: { id: currentUser.id as string },
        data: { avatar: null },
        include: {
            _count: true,
            savedPosts: {
                select: {
                    id: true,
                },
            },
        },
    });

    res.status(200).json({ user: updatedUser });
});

export default api.handler({
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

export const config = {
    api: {
        bodyParser: false,
    },
};
