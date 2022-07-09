import React from 'react';
import { GetServerSideProps } from 'next';
import { CircularProgress } from '@mui/material';
import useSWR from 'swr';
import UserPageLayout from '../../layouts/UserPageLayout';
import Post from '../../components/post/card/Post';
import { CurrentUser, withAuth } from '../../utils/auth';
import { http } from '../../services';
import { db } from '../../../prisma/db';
import { Post as IPost, Prisma, User } from '@prisma/client';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = await db.user.findUnique({
        where: { username: context.query.username as string },
        include: {
            _count: true,
        },
    });

    if (!user) return { notFound: true };
    const { currentUser } = withAuth(context);

    return {
        props: {
            isMyPage: user.id === currentUser.id,
            user: JSON.parse(JSON.stringify(user)),
        },
    };
};

const UserPage = ({ user, isMyPage }: UserPageProps) => {
    const { data, error } = useSWR<GetUserPostsResponse>(`/api/authors/${user.id}/posts`, (url: string) =>
        http.get(url).then((res) => res.data)
    );

    return (
        <UserPageLayout user={user}>
            <h2 className="text-2xl font-bold text-neutral-800 mb-4 mt-12">All Posts</h2>
            {!error ? (
                <>
                    {data ? (
                        <>
                            {data.posts?.length > 0 ? (
                                <>
                                    {data.posts.map((post) => (
                                        <Post
                                            key={post.id}
                                            post={post}
                                            showUserInfo={false}
                                            myPost={isMyPage}
                                            showStatus={isMyPage}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className="w-full h-screen text-center mt-44">
                                    <h1 className="text-2xl font-semibold">Not Post Found</h1>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-screen w-full">
                            <CircularProgress />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-screen w-full">
                    <h2 className="text-2xl">faild to get posts</h2>
                </div>
            )}
        </UserPageLayout>
    );
};

export default UserPage;

interface UserPageProps {
    user: User & { _count: Prisma.UserCountOutputType };
    isMyPage: boolean;
}

type GetUserPostsResponse  = {
    posts: (IPost & { author: User })[];
}
