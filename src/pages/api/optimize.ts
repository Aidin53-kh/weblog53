import { readdir, unlink } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const users = await db.user.findMany({
        where: { avatar: { not: null } },
        select: { avatar: true },
    });

    const posts = await db.post.findMany({
        where: { images: { isEmpty: false } },
        select: { images: true },
    });

    const usefullAvatars = users.map((user) => user.avatar);
    const usefullPostImages = posts.map((post) => post.images).flat();

    readdir('public/uploads/avatar', (err, files) => {
        if (err) return console.log(err);
        files.forEach((file) => {
            if (!usefullAvatars.includes(file)) {
                unlink(`public/uploads/avatar/${file}`, (err) => {
                    if (err) return console.log(err);
                    console.log(`unused image (deleted): /avatar/${file}`);
                });
            }
        });
    });

    readdir('public/uploads/post', (err, files) => {
        if (err) return console.log(err);
        files.forEach((file) => {
            if (!usefullPostImages.includes(file)) {
                unlink(`public/uploads/post/${file}`, (err) => {
                    if (err) return console.log(err);
                    console.log(`unused image (deleted): /post/${file}`);
                });
            }
        });
        res.status(200).json({ success: true });
    });
};
