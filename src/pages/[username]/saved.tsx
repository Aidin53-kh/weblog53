import { GetServerSideProps } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import UserPageLayout from '../../layouts/UserPageLayout';
import { withAuth } from '../../utils/auth';
import { useAppContext } from '../../providers/AppProvider';
import { http } from '../../services';
import { UserTab } from '../../components/user/Tabs';
import Post from '../../components/post/card/Post';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { currentUser } = withAuth(context);

    if (currentUser.username !== context.params?.username) {
        return {
            notFound: true,
        };
    }

    return { props: {} };
};

const Saved = () => {
    const context = useAppContext();
    const { query } = useRouter();

    const { data, error } = useSWR(`/api/posts/saved`, (url) =>
        http.get(url).then((res) => res.data)
    );

    if (context.authLoading) return 'loading...';
    if (isEmpty(context.user)) {
        return (
            <div className="w-full h-screen text-center">
                <Error statusCode={404} />
            </div>
        );
    }

    return (
        <UserPageLayout user={context.user} activeTab={UserTab.SAVED}>
            <h2 className="text-2xl font-bold text-neutral-800 mb-4 mt-12">Saved Posts</h2>
            {!error ? (
                <>
                    {data ? (
                        <>
                            {data.posts.map((post: any) => (
                                <Post key={post.id} post={post} />
                            ))}
                        </>
                    ) : (
                        <div className="w-full h-screen text-center mt-36">
                            <h1 className="text-xl">Loading Posts...</h1>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-screen text-center mt-36">
                    <h2 className="text-xl">faild to get posts</h2>
                </div>
            )}
        </UserPageLayout>
    );
};

export default Saved;
