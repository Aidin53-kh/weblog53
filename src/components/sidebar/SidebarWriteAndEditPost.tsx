import { CircularProgress } from '@mui/material';
import { Post } from '@prisma/client';
import useSWR from 'swr';
import { Sidebar } from '.';
import { http } from '../../services';
import Button from '../button';
import SmallPost from '../post/card/SmallPost';

interface SidebarWriteAndEditPostProps {
    onPublish: () => void;
}

const SidebarWriteAndEditPost = ({ onPublish }: SidebarWriteAndEditPostProps) => {
    const { data, error } = useSWR(`/api/posts/private`, (url) => http.get(url).then((res) => res.data));

    return (
        <Sidebar className="py-6">
            <Button fullWidth onClick={onPublish}>
                publish
            </Button>
            <div>
                <h2 className="text-lg font-semibold pt-8 mb-6">unPublished posts</h2>
                {!error ? (
                    <>
                        {data ? (
                            <>
                                {data.posts.map((post: any) => (
                                    <SmallPost key={post.id} post={post} showUserInfo={false} showEditButton showDeleteButton />
                                ))}
                            </>
                        ) : (
                            <div className="text-center mt-12">
                                <CircularProgress size={20} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-rose-50 rounded-lg px-3 my-4 py-6 text-center max-w-xs mx-auto">
                        <h3 className="text-red-500 font-semibold">Oops! Request Faild ({error.response.status})</h3>
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default SidebarWriteAndEditPost;
