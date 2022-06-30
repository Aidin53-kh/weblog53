import Link from 'next/link';
import { Avatar } from '@mui/material';
import { faker } from '@faker-js/faker';
import { formatDate } from '../../../utils/date';

interface SmallPostProps {
    post: any;
    showUserInfo?: boolean;
    showEditButton?: boolean;
    showDeleteButton?: boolean;
    showLeftLine?: boolean;
}

const SmallPost: React.FC<SmallPostProps> = ({ post, showUserInfo = true, showEditButton = false, showDeleteButton = false, showLeftLine = false }) => {
    return (
        <div className="flex gap-5 mb-7 relative">
            {showLeftLine && <div className="h-full bg-blue-400 w-[2px] absolute top-0 -left-4 rounded-md"></div>}
            <div className="flex-[7]">
                <div className="flex items-center gap-2 mb-2">
                    {showUserInfo && (
                        <>
                            <Link href={`/${post.user.username}`}>
                                <a>
                                    {post.user.avatar ? (
                                        <Avatar
                                            className="h-6 w-6"
                                            src={`http://localhost:8000/public/avatars/${post.user.avatar}`}
                                        />
                                    ) : (
                                        <Avatar className="h-8 w-8" />
                                    )}
                                </a>
                            </Link>
                            <Link href={`/${post.user.username}`}>
                                <a>
                                    <h4 className="mr-2">{post.user.username}</h4>
                                </a>
                            </Link>
                        </>
                    )}
                    <p className="text-sm text-gray-500 flex-1">{formatDate(post.createdAt)}</p>
                    <div className="flex items-center gap-4">
                        {showDeleteButton && <button className="text-red-500 text-sm">Delete</button>}
                        {showEditButton && (
                            <Link href={`/edit/${post._id}`}>
                                <button className="text-green-500 text-sm">Edit</button>
                            </Link>
                        )}
                    </div>
                </div>
                <Link href={`/posts/${post._id}`}>
                    <a>
                        <h2 className="text-neutral-900 truncate2 font-semibold mb-2">{post.title}</h2>
                    </a>
                </Link>
            </div>

            <div className="flex-[2] overflow-hidden items-center max-h-36">
                <img
                    src={post?.thumbnail ? `http://localhost:8000/public/posts/${post.thumbnail}` : faker.image.image()}
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default SmallPost;
