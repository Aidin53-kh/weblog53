import { CircularProgress } from '@mui/material';
import useSWR from 'swr';
import { http } from '../../../services';
import { Container } from '../../sidebar';
import Post from '../card/Post';
import { Comment, Post as IPost, Prisma, User } from '@prisma/client';

interface MoreFromUserProps {
    post: IPost & {
        author: User;
    };
}

interface GetUserPostsResponse {
    posts: (IPost & { author: User })[];
}

export const MoreFromUser = ({ post }: MoreFromUserProps) => {
    const { data, error } = useSWR<GetUserPostsResponse>(`/api/authors/${post.author.id}/posts`, (url) =>
        http.get(url).then((res) => res.data)
    );

    return (
        <div className="bg-gray-50">
            <Container>
                <div className="ltr pt-10 mb-6">
                    <h3 className="text-2xl text-neutral-900 font-bold mb-2">More From {post.author.username}</h3>
                    <p className="text-gray-500 text-sm">{post.author.bio}</p>
                </div>

                <div>
                    {!error ? (
                        <>
                            {!data ? (
                                <div className="text-center my-12">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <>
                                    {data.posts.length > 1 ? (
                                        <>{data.posts.map((p: any) => p.id !== post.id && <Post key={p.id} post={p} />)}</>
                                    ) : (
                                        <div className="text-center py-12">
                                            <h3 className="font-semibold">There is no other post</h3>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="font-semibold">Faild To Get Enother Posts</h3>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};
