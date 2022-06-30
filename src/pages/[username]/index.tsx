import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import useSWR from 'swr';
import UserPageLayout from '../../layouts/UserPageLayout';
import Post from '../../components/post/card/Post';
import { useAuth } from '../../utils/auth';
import { http } from '../../services';

const UserPage = ({ user, isMyPage }: any) => {
    const router = useRouter();
    const { data, error } = useSWR(
        `/posts/user/${user._id}?search=${router.query.search || ''}${isMyPage ? '&showPrivate=true' : ''}`,
        (url: string) => http.get(url).then((res) => res.data)
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
                                    {data.posts.map((post: any) => (
                                        <Post
                                            key={post._id}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch(`http://localhost:8000/users/${context.params?.username}`);
    const user = await res.json();

    if (!user.username) {
        return {
            notFound: true,
        };
    }

    const { username } = useAuth(context);
    return {
        props: {
            isMyPage: username === user.username,
            user,
        },
    };
};

export default UserPage;
