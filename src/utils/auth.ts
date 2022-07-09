import { GetServerSidePropsContext } from 'next';
import jwt from 'jsonwebtoken';

export type CurrentUser = {
    username: null | string;
    id: null | string;
}

export function withAuth(context: GetServerSidePropsContext | string) {
    let token: string;
    
    let result = {
        isAuthentcate: false,
        currentUser: {
            username: null,
            id: null
        } as CurrentUser
    };

    if (typeof context === 'object') {
        token = context.req.cookies['access_token'] as string;
    } else if (typeof context === 'string') {
        token = context;
    } else return result;

    jwt.verify(token, process.env.JWT_SECRET as string, (error, decodedToken: any) => {
        if (error) return console.log(error);
        if (decodedToken.username) {
            result = {
                isAuthentcate: true,
                currentUser: {
                    username: decodedToken.username,
                    id: decodedToken.id
                }
            };
        }
    });

    return result;
}
