import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookmarkAddOutlined, BookmarkOutlined, MoreHoriz } from '@mui/icons-material';
import { Bookmark, BookmarkFill, BookmarkPlus } from 'react-bootstrap-icons';
import { Avatar, CircularProgress } from '@mui/material';
import { faker } from '@faker-js/faker';
import { isEmpty } from 'lodash';
import { http } from '../../../services';
import { useAppContext } from '../../../providers/AppProvider';
import { MyPostDropdown } from '../dropdown';
import { formatDate } from '../../../utils/date';
import { Post as IPost, User } from '@prisma/client';

interface PostProps {
    post: IPost & {
        author: Partial<User>;
    };
    showUserInfo?: boolean;
    myPost?: boolean;
    showStatus?: boolean;
}

const Post: React.FC<PostProps> = ({ post, showUserInfo = true, myPost = false, showStatus = false }) => {
    const { user, setUser, isAuthenticate } = useAppContext();

    const [isOpen, setIsOpen] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSavePost = async () => {
        setLoading(true);
        try {
            const { data } = await http.get(`/api/posts/${post.id}/save`);
            setIsSaved(data.isSave);
            setUser(data.user);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEmpty(user)) setIsSaved(false);
        else if (user.savedPosts.some((savedPost: any) => savedPost.id === post.id)) {
            setIsSaved(true);
        } else setIsSaved(false);
    }, [user]);

    return (
        <div className="border-b pt-6 pb-3 sm:py-6">
            <header className="flex items-center justify-between gap-9 mb-3">
                {showUserInfo ? (
                    <>
                        <div className="flex flex-[7] items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link href={`/${post.author.username}`}>
                                    <a>
                                        {post.author.avatar ? (
                                            <Avatar
                                                className="h-8 w-8"
                                                src={`http://localhost:3000/uploads/avatar/${post.author.avatar}`}
                                            />
                                        ) : (
                                            <Avatar className="h-8 w-8" />
                                        )}
                                    </a>
                                </Link>
                                <Link href={`/${post.author.username}`}>
                                    <a>
                                        <h4 className="font-semibold">{post.author.username}</h4>
                                    </a>
                                </Link>
                                <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                            </div>
                            {myPost && <MoreHoriz className="text-gray-500" onClick={(e) => setIsOpen(e.target)} />}
                        </div>
                        <div className="flex-[2]"></div>
                    </>
                ) : (
                    <div className="flex items-center w-full sm:gap-9">
                        <div className="flex-[7] flex items-center justify-between">
                            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                            {myPost && <MoreHoriz className="text-gray-500" onClick={(e) => setIsOpen(e.target)} />}
                        </div>
                        <div className="sm:flex-[3] md:flex-[2]"></div>
                    </div>
                )}
            </header>

            <main className="flex gap-9">
                <div className={`flex-[7] ${post.rtl && 'rtl'}`}>
                    <Link href={`/posts/${post.id}`}>
                        <a>
                            <h2 className="text-xl sm:text-2xl text-neutral-800 font-bold truncate2 mb-2">{post.title}</h2>
                        </a>
                    </Link>
                    <p className="text-gray-800 text-sm sm:text-base truncate3">{post.description}</p>
                </div>
                <div className="flex flex-[4] sm:flex-[3] md:flex-[2] overflow-hidden items-center max-h-32 rounded-lg">
                    <img
                        className="rounded-lg"
                        src={post.thumbnail ? `http://localhost:3000/uploads/post/${post.thumbnail}` : faker.image.image()}
                        loading="lazy"
                    />
                </div>
            </main>

            <footer className="flex items-center justify-between mt-6 sm:gap-9">
                <div className="flex items-center justify-between flex-[7]">
                    {loading ? (
                        <div>
                            <CircularProgress size={18} />
                        </div>
                    ) : (
                        <span onClick={handleSavePost}>
                            {isSaved ? (
                                <BookmarkFill className="text-neutral-700 text-lg" />
                            ) : (
                                <BookmarkPlus className="text-neutral-500 text-lg" />
                            )}
                        </span>
                    )}
                    <div className="flex items-center gap-4">
                        {showStatus && (
                            <>
                                {post.isPublic ? (
                                    <div className="border border-green-200 text-green-500 text-sm rounded-full py-[1px] px-3 flex text-center">
                                        Public
                                    </div>
                                ) : (
                                    <div className="border border-red-200  text-red-500 text-sm rounded-full py-[1px] px-3 flex text-center">
                                        Private
                                    </div>
                                )}
                            </>
                        )}

                        {post.tags && (
                            <div className="bg-gray-100 text-gray-800 text-sm rounded-full py-[2px] px-2 flex text-center">
                                {post.tags[0]}
                            </div>
                        )}
                        <p className="text-sm text-gray-500">{post.readingTime} min read</p>
                    </div>
                </div>
                <div className="sm:flex-[3] md:flex-[2]"></div>
            </footer>

            <MyPostDropdown open={isOpen} setOpen={setIsOpen} postId={post.id} />
        </div>
    );
};

export default Post;
