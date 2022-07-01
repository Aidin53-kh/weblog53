import { NextPage } from 'next';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Container from '../components/container';
import AppSidebar from '../components/sidebar/AppSidebar';
import Post from '../components/post/card/Post';
import { http } from '../services';
import { CircularProgress } from '@mui/material';

const Home: NextPage = () => {
    const router = useRouter();
    const { data, error } = useSWR(`/posts/?search=${router.query.search || ''}`, (url) => http.get(url).then((res) => res.data));

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
                                            {data.posts.map((post: any) => (
                                                <>
                                                    <Post key={post._id} post={post} />
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
                        <div className="w-full text-center mt-44">
                            <h2 className="text-2xl">faild to get posts</h2>
                        </div>
                    )}
                </Container>
            </div>
            <AppSidebar />
        </Fragment>
    );
};

export default Home;
