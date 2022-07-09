import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const templateWords = req.body.template.split(' ').length;
        const wpm = 200;
        const time = Math.ceil(templateWords / wpm);
        const tags = req.body.tags.map((tag: string) =>
            tag.toString().toLowerCase().trim(),
        );
        const post = await db.post.create({
            data: {
                ...req.body,
                readingTime: time,
                tags,
            },
        });
        
        res.status(201).json(post);
    } 

    else if (req.method === 'GET') {
        const posts = await db.post.findMany({
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
        }); 
        
        return res.status(200).json({ posts });
    }

    else return res.status(405).json({ message: 'method not allowed' });
};
