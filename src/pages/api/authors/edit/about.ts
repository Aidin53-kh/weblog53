import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../prisma/db';
import { withAuth } from '../../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const token = req.cookies['access_token'] as string;
    const { isAuthentcate, currentUser } = withAuth(token);

    if (!isAuthentcate) return res.status(401).json({ message: 'auth require' });

    const user = await db.user.findUnique({
        where: { id: currentUser.id as string },
        select: {
            about: {
                select: {
                    userId: true
                }
            }
        }
    });

    if (!user) return res.status(401).json({ message: 'auth require' });
    console.log(req.body)
    if (user.about) {
        const about = await db.about.update({
            where: { userId: currentUser.id as string },
            data: req.body,
        });

        res.status(200).json({ about });
    } else {
        const about = await db.about.create({ 
            data: {
                userId: currentUser.id as string,
                ...req.body,
            }  
        });

        res.status(200).json({ about });
    }
};
