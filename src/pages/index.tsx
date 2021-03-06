import { NextPage } from 'next';
import { Fragment } from 'react';
import useSWR from 'swr';
import Container from '../components/container';
import AppSidebar from '../components/sidebar/AppSidebar';
import Post from '../components/post/card/Post';
import { http } from '../services';
import { CircularProgress } from '@mui/material';
import { Post as IPost } from '@prisma/client';


const Home: NextPage = () => {
    const { data, error } = useSWR<GetAllPostsResponse>(`/api/posts`, (url) => http.get(url).then((res) => res.data));

    return (
        <Fragment>
            <div className="border-r w-full pt-8">
                <Container>
                    <h2 className="text-2xl mb-6 font-bold text-neutral-800">Recent Posts</h2>
                    {!error ? (
                        <>
                            {data?.posts ? (
                                <>
                                    {data.posts.length > 0 ? (
                                        <>
                                            {data.posts.map((post) => (
                                                <>
                                                    <Post key={post.id} post={post} />
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="w-full text-center mt-44">
                                            <h1 className="text-2xl font-semibold">Not Post Found</h1>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full text-center mt-44">
                                    <CircularProgress size={24} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-rose-50 rounded-lg px-3 my-40 py-6 text-center max-w-sm mx-auto">
                            <h3 className="text-red-500 font-semibold">Oops! Request Faild ({error.response.status})</h3>
                        </div>
                    )}
                </Container>
            </div>
            <AppSidebar />
        </Fragment>
    );
};

export interface GetAllPostsResponse {
    posts: (IPost & {
        author: {
            username: string;
            avatar: string | null;
            id: string;
        };
    })[];
}

export default Home;
