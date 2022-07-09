import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader(
        'Set-Cookie',
        serialize('access_token', "", {
            httpOnly: true,
            maxAge: 0,
            path: '/',
        })
    )

    res.status(200).json({ success: true });
};
