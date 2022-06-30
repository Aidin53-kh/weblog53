import { GetServerSidePropsContext } from "next";
import * as jwt from 'jsonwebtoken';

export function useAuth(context: GetServerSidePropsContext) {
    const token = context.req.cookies['access_token'];
    let result = {
        isAuthentcate: false,
        username: '',
    };

    if (!token) return result;

    jwt.verify(token, 'jwt-secret', (error: any, decodedToken: any) => {
        if (error) return console.log(error);
        if (decodedToken.username) {
            result = {
                isAuthentcate: true,
                username: decodedToken.username,
            };
        }
    });

    return result;
}
