import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { randomUUID } from 'crypto';
import multer from 'multer';

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads/post',
        filename: (_, file, cb) => {
            cb(null, `${randomUUID()}-${file.originalname}`);
        },
    }),
});

const api = createRouter<NextApiRequest & { files: Express.Multer.File[] }, NextApiResponse>(); 

// @ts-ignore
api.post(upload.array('images'), (req, res) => {
    const result = req.files.map((file, i) => ({
        file: file.filename,
        ref: req.body.refs[i],
    }));

    res.status(200).json(result);
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
