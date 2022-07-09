import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Clear } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import { isEmpty } from 'lodash';
import { Comment } from './Comment';
import { CommentEditor } from './CommnetEditor';
import { http } from '../../../services';
import { IComment } from './types';
import { useRouter } from 'next/router';

interface CommentSidebarProps {
    post: any;
    setCommentsCount: Dispatch<SetStateAction<number>>;
    commentsCount: number;
    setOpenCommentSidebar: Dispatch<SetStateAction<boolean>>;
    openCommentSidebar: boolean;
}

export const CommentSidebar: FC<CommentSidebarProps> = ({
    post,
    setCommentsCount,
    commentsCount,
    openCommentSidebar,
    setOpenCommentSidebar,
}) => {
    const { query } = useRouter();

    const [fetchCommentsLoading, setFetchCommentsLoading] = useState(false);
    const [refetchCommentsLoading, setReftchCommentsLoading] = useState(false);
    const [sendCommentLoading, setSendCommentLoading] = useState(false);

    const [comments, setComments] = useState<IComment[]>([]);
    const [isCommentsFetched, setIsCommentsFetched] = useState(false);

    const getCommnets = async (mode?: 'clear') => {
        isEmpty(comments) ? setFetchCommentsLoading(true) : setReftchCommentsLoading(true);
        try {
            const { data } = await http.get(`comments/${post.id}?skip=${comments.length}`);
            if (mode === 'clear') {
                setComments(data.comments);
            } else {
                setComments([...comments, ...data.comments]);
            }
            setIsCommentsFetched(true);
        } catch (error) {
            console.log(error);
            alert('get post comment error');
        } finally {
            setFetchCommentsLoading(false);
            setReftchCommentsLoading(false);
        }
    };

    const addComment = async (template: string, rtl: boolean) => {
        setSendCommentLoading(true);
        try {
            const { data } = await http.post(`/comments/${post.id}`, { template, rtl });
            setCommentsCount((c) => c + 1);
            setComments([data, ...comments]);
        } catch (error) {
            console.log(error);
            alert('add comment error');
        } finally {
            setSendCommentLoading(false);
        }
    };

    useEffect(() => {
        setComments([]);
        setIsCommentsFetched(false);
        if (openCommentSidebar) getCommnets('clear');
    }, [query]);

    useEffect(() => {
        if (openCommentSidebar && !isCommentsFetched) getCommnets();
    }, [openCommentSidebar]);

    return (
        <>
            <aside
                className={`fixed inset-y-0 h-screen overflow-auto duration-500 px-5 bg-white min-w-[420px] max-w-[420px] border-l z-20 shadow-lg ${
                    openCommentSidebar ? 'right-0' : '-right-[100%]'
                }`}
            >
                <header className="flex items-center justify-between py-5">
                    <h2 className="text-xl text-neutral-900 font-semibold">Responses ({commentsCount})</h2>
                    <IconButton onClick={() => setOpenCommentSidebar(false)}>
                        <Clear />
                    </IconButton>
                </header>

                <div className="mb-12">
                    <CommentEditor onSubmit={addComment} isLoading={sendCommentLoading} />
                </div>

                <div className="mb-24">
                    {fetchCommentsLoading ? (
                        <div className="flex justify-center my-24">
                            <CircularProgress size={23} />
                        </div>
                    ) : (
                        <>
                            {comments.length > 0 ? (
                                <>
                                    {comments.map((comment) => (
                                        <Comment
                                            setComments={setComments}
                                            setCommentsCount={setCommentsCount}
                                            key={comment.id}
                                            comment={comment}
                                            postId={post.id}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className="flex justify-center my-24">
                                    <p className="text-gray-800 font-semibold">No comments have been posted</p>
                                </div>
                            )}
                            {comments.length < commentsCount && (
                                <div className="flex tiems-center justify-center">
                                    {refetchCommentsLoading ? (
                                        <CircularProgress size={23} />
                                    ) : (
                                        <p className="text-blue-500 text-sm cursor-pointer" onClick={() => getCommnets()}>
                                            Show More
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </aside>
            <div
                className={`w-screen h-screen fixed bg-gray-900/20 duration-300 z-10 ${
                    openCommentSidebar ? 'visible opacity-1' : 'invisible opacity-0'
                }`}
                onClick={() => setOpenCommentSidebar(false)}
            />
        </>
    );
};
