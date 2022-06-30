import { Fragment, useState, useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
    BookmarkOutlined,
    MoreHoriz,
    ThumbUpAltOutlined,
    ThumbUp,
    ChatBubbleOutlineRounded,
    BookmarkAddOutlined,
} from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import { isEmpty } from 'lodash';
import { Container } from '../../components/sidebar';
import { useAuth } from '../../utils/auth';
import { useAppContext } from '../../providers/AppProvider';
import { MyPostDropdown, UserPostDropdown } from '../../components/post/dropdown';
import { MoreFromUser } from '../../components/post/details/MoreFromUser';
import { PostDetailsHeader } from '../../components/post/details/PostDetailsHeader';
import { PostTags } from '../../components/post/details/PostTags';
import { CommentSidebar } from '../../components/post/comment/CommentSidebar';
import { Pages } from '../../components/auth/types';
import { http } from '../../services';
import PostSidebar from '../../components/sidebar/PostSidebar';

const PostDetails = ({ post, isMyPost }: any) => {
    const { query } = useRouter();
    const { user, setUser, isAuthenticate, openLoginAndRegisterDialog } = useAppContext();

    const [isPostLiked, setIsPostLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [commentsCount, setCommentsCount] = useState(post.comments.length);
    const [openCommentSidebar, setOpenCommentSidebar] = useState(false);
    const [isOpenMenu, setIsOpenMenu] = useState<null | HTMLElement>(null);

    const likePost = async (postId: string) => {
        if (!isAuthenticate) return openLoginAndRegisterDialog(Pages.LOGIN);
        setLikeLoading(true);
        try {
            const { data } = await http.post(`/posts/${postId}/like`);
            setLikesCount(data.post.likes.length);
            setIsPostLiked(data.isPostLiked);
        } catch (error) {
            console.log(error);
        } finally {
            setLikeLoading(false);
        }
    };

    const savePost = async (postId: string) => {
        if (!isAuthenticate) return openLoginAndRegisterDialog(Pages.LOGIN);
        setBookmarkLoading(true);
        try {
            const { data } = await http.get(`/posts/${postId}/save`);
            setIsSaved(data.isSave);
            setUser({ ...user, savaedPosts: data.savedPosts });
        } catch (error) {
            console.log(error);
        } finally {
            setBookmarkLoading(false);
        }
    };

    useEffect(() => {
        setLikesCount(post.likes.length);
        setCommentsCount(post.comments.length);
        if (!isEmpty(user) && post.likes?.includes?.(user._id)) setIsPostLiked(true);
        else setIsPostLiked(false);
        if (!isEmpty(user)) setIsSaved(user?.savaedPosts?.includes?.(post._id));
        else setIsSaved(false);
    }, [query, user._id]);

    return (
        <Fragment>
            <div className="w-full pt-10 child:leading-8">
                <Container>
                    <PostDetailsHeader post={post} setOpenDropdown={setIsOpenMenu} />

                    <main className={`${post?.rtl ? 'rtl' : ''}`} dangerouslySetInnerHTML={{ __html: post.template }}></main>

                    <PostTags tags={post.tags} />

                    <div className="flex items-center justify-between mt-12 pb-4">
                        <div className="flex items-center gap-3">
                            {!likeLoading ? (
                                <IconButton onClick={() => likePost(post._id)}>
                                    {isPostLiked ? (
                                        <ThumbUp className="text-gray-600" />
                                    ) : (
                                        <ThumbUpAltOutlined className="text-gray-400" />
                                    )}
                                </IconButton>
                            ) : (
                                <CircularProgress size={18} className="mx-[11px]" />
                            )}
                            <span className="font-semibold">{likesCount}</span>
                            <span className="text-gray-200">|</span>
                            <IconButton onClick={() => setOpenCommentSidebar(true)}>
                                <ChatBubbleOutlineRounded className="text-gray-400" />
                            </IconButton>
                            <span className="font-semibold">{commentsCount.toString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {bookmarkLoading ? (
                                <CircularProgress size={18} className="mx-[11px]" />
                            ) : (
                                <IconButton onClick={() => savePost(post._id)}>
                                    {isSaved ? (
                                        <BookmarkOutlined className="text-neutral-700" />
                                    ) : (
                                        <BookmarkAddOutlined className="text-gray-400" />
                                    )}
                                </IconButton>
                            )}
                            <IconButton>
                                <MoreHoriz className="text-gray-500" onClick={(e) => setIsOpenMenu(e.target as HTMLElement)} />
                            </IconButton>
                        </div>
                    </div>
                </Container>

                <MoreFromUser post={post} />
            </div>
            <PostSidebar user={post.user} postId={post._id} />

            {isMyPost && !isEmpty(user) ? (
                <MyPostDropdown open={isOpenMenu} setOpen={setIsOpenMenu} postId={post._id} />
            ) : (
                <UserPostDropdown open={isOpenMenu} setOpen={setIsOpenMenu} />
            )}

            <CommentSidebar
                post={post}
                setCommentsCount={setCommentsCount}
                commentsCount={commentsCount}
                openCommentSidebar={openCommentSidebar}
                setOpenCommentSidebar={setOpenCommentSidebar}
            />
        </Fragment>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch(`http://localhost:8000/posts/${context.params?.postId}`);
    if (res.status !== 200) return { notFound: true };

    const post = await res.json();
    const { username } = useAuth(context);
    
    if (!post) return { notFound: true };
    if (!post.isPublic && username !== post.user.username) return { notFound: true };

    return {
        props: {
            isMyPost: username === post.user.username,
            post,
        },
    };
};

export default PostDetails;
