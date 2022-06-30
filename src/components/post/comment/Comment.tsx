import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChatBubbleOutlineRounded, MoreHoriz, ThumbDown, ThumbUp, ThumbUpAltOutlined } from '@mui/icons-material';
import { Avatar, CircularProgress, IconButton } from '@mui/material';
import faker from '@faker-js/faker';
import { isEmpty } from 'lodash';
import { IComment } from './types';
import { useAppContext } from '../../../providers/AppProvider';
import { CommentDropdown } from '../dropdown/CommentDropdown';
import { timeSince } from '../../../utils/date';
import { CommentEditor } from './CommnetEditor';
import { http } from '../../../services';
import { Pages } from '../../auth/types';

interface CommnetProps {
    comment: IComment;
    setComments: Dispatch<SetStateAction<IComment[]>>;
    postId: string;
    setCommentsCount: Dispatch<SetStateAction<number>>;
    setCurrentScopComments?: Dispatch<SetStateAction<IComment[]>>;
    setCurrentScopCommentsCount?: Dispatch<SetStateAction<number>>;
    setCurrentScopLoading?: Dispatch<SetStateAction<boolean>>;
    setShowCurrentReplysSectionScop?: Dispatch<SetStateAction<boolean>>;
}

export const Comment: React.FC<CommnetProps> = ({
    comment,
    postId,
    setComments,
    setCommentsCount,
    setCurrentScopComments,
    setCurrentScopCommentsCount,
    setCurrentScopLoading,
    setShowCurrentReplysSectionScop,
}) => {
    const { user, openLoginAndRegisterDialog } = useAppContext();

    const [showCommentEditor, setShowCommentEditor] = useState(false);
    const [openCommentDropdown, setOpenCommentDropdown] = useState<any>(null);
    const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);

    const [addReplyLoading, setAddReplyLoading] = useState(false);
    const [fetchReplysLoading, setFetchReplyLoading] = useState(false);
    const [showReplysSection, setShowReplysSection] = useState(false);
    const [replys, setReplys] = useState<IComment[]>([]);
    const [replysCount, setReplysCount] = useState(comment.replys.length);

    const [editMode, setEditMode] = useState(false);
    const [editCommentLoading, setEditCommentLoading] = useState(false);

    const [isCommentLiked, setIsCommentLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(comment.likes.length);
    const [likeLoading, setLileLoading] = useState(false);        

    const getReplys = async () => {
        setFetchReplyLoading(true);
        try {
            const { data } = await http.get(`/comments/${postId}/${comment._id}`);
            setReplys(data);
            setReplysCount(data.length);
            if (!data.length) setShowReplysSection(false);
        } catch (error) {
            console.log(error);
            alert('error on get replys');
        } finally {
            setFetchReplyLoading(false);
        }
    };

    const getCurrentScopReplys = async () => {
        setCurrentScopLoading?.(true);
        try {
            const { data } = await http.get(`/comments/${postId}/${comment.commentId}`);
            setCurrentScopComments?.(data);
            setCurrentScopCommentsCount?.(data.length);
            if (!data.length) setShowCurrentReplysSectionScop?.(false);
        } catch (error) {
            console.log(error);
            alert('error on get replys');
        } finally {
            setCurrentScopLoading?.(false);
        }
    };

    const addReply = async (template: string, rtl: boolean) => {
        setAddReplyLoading(true);
        try {
            const { data } = await http.post(`/comments/${postId}/${comment._id}`, { template, rtl });
            setShowCommentEditor(false);
            getReplys();
        } catch (error) {
            console.log(error);
            alert('error on add reply');
        } finally {
            setAddReplyLoading(false);
        }
    };

    const deleteComment = async () => {
        setDeleteCommentLoading(true);
        try {
            const { data } = await http.delete(`/comments/${postId}/${comment._id}`);
            setComments((comments) => comments.filter((comment) => comment._id !== data._id));
            setCommentsCount((c) => c - 1);
        } catch (error: any) {
            console.log(error.response);
            alert('error in delete comment');
        } finally {
            setDeleteCommentLoading(false);
        }
    };

    const deleteReply = async () => {
        setDeleteCommentLoading(true);
        try {
            const { status } = await http.delete(`/comments/${postId}/${comment.commentId}/${comment._id}`);
            getCurrentScopReplys();
        } catch (error: any) {
            console.log(error.response);
            alert('error in delete reply');
        } finally {
            setDeleteCommentLoading(false);
        }
    };

    const editCommentOrReply = async (template: string, rtl: boolean) => {
        setEditCommentLoading(true);
        try {
            const { data } = await http.patch(`/comments/${postId}/${comment._id}`, { template, rtl });
            console.log('comment edited: ', data);
            if (data.roll === 'Comment') {
                setComments((comments) => {
                    const commentsList = [...comments];
                    const commentIndex = comments.findIndex((c) => c._id === data._id);
                    commentsList[commentIndex] = data;
                    return commentsList;
                });
            } else {
                getCurrentScopReplys();
            }
            setEditMode(false);
        } catch (error: any) {
            console.log(error.response);
            alert('error in edit comment or reply');
        } finally {
            setEditCommentLoading(false);
        }
    };

    const handleLikeComment = async () => {
        if (isEmpty(user)) return openLoginAndRegisterDialog(Pages.LOGIN);
        setLileLoading(true);
        try {
            const { data } = await http.post(`/comments/${comment._id}/like`);
            setIsCommentLiked(data.isCommentLiked);
            setLikesCount(data.likesCount);
        } catch (error: any) {
            console.log(error.response);
            alert('error on like comment');
        } finally {
            setLileLoading(false);
        }
    };

    useEffect(() => {
        if (showReplysSection) getReplys();
    }, [showReplysSection]);

    useEffect(() => {
        if (comment.likes.includes(String(user._id))) setIsCommentLiked(true);
        else setIsCommentLiked(false);
    }, [user]);

    return (
        <div className={`mb-6 last:mb-0 last:border-b-white ${!showCommentEditor ? 'border-b' : ''}`}>
            <CommentDropdown
                setEditMode={setEditMode}
                open={openCommentDropdown}
                setOpen={setOpenCommentDropdown}
                comment={comment}
                deleteLoading={deleteCommentLoading}
                deleteComment={deleteComment}
                deleteReply={deleteReply}
            />
            <header className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-2">
                    <Avatar
                        src={
                            comment.user.avatar
                                ? `http://localhost:8000/public/avatars/${comment.user.avatar}`
                                : faker.image.avatar()
                        }
                    />
                    <div>
                        <h4 className="text-sm">
                            {comment.user.username} {!isEmpty(user) && user._id === comment.user && `(my comment)`}
                        </h4>
                        <p className="text-gray-500 text-sm">{timeSince(comment.createdAt)}</p>
                    </div>
                </div>
                {!isEmpty(user) && user?._id === comment?.user?._id && (
                    <IconButton onClick={(e) => setOpenCommentDropdown(e.target as HTMLElement)}>
                        <MoreHoriz />
                    </IconButton>
                )}
            </header>

            {editMode ? (
                <div className="my-4">
                    <CommentEditor
                        onSubmit={editCommentOrReply}
                        isLoading={editCommentLoading}
                        defaultTemplate={comment.template}
                        defaultDir={comment.rtl}
                        cancelButton
                        cancelButtonFn={() => setEditMode(false)}
                        editMode
                    />
                </div>
            ) : (
                <main
                    className={`my-4 leading-6 ${comment.rtl ? 'rtl' : 'ltr'}`}
                    dangerouslySetInnerHTML={{ __html: comment.template }}
                />
            )}

            <footer className="flex items-center justify-between gap-5 mb-3">
                <div className="flex items-center gap-2">
                    {likeLoading ? (
                        <CircularProgress size={18} className="mx-[6px] my-[6px]" />
                    ) : (
                        <IconButton size="small" onClick={handleLikeComment}>
                            {isCommentLiked ? <ThumbUp fontSize="small" /> : <ThumbUpAltOutlined fontSize="small" />}
                        </IconButton>
                    )}
                    <span className="mr-3">{likesCount}</span>
                    {replysCount > 0 && (
                        <>
                            <IconButton size="small" onClick={() => setShowReplysSection(!showReplysSection)}>
                                <ChatBubbleOutlineRounded fontSize="small" />
                            </IconButton>
                            <span className="mr-3 text-sm">{showReplysSection ? 'hide replys' : replysCount}</span>
                        </>
                    )}
                </div>
                <div>
                    <p className="text-blue-500" onClick={() => setShowCommentEditor(!showCommentEditor)}>
                        Reply
                    </p>
                </div>
            </footer>

            <div className="border-l-2 border-l-gray-300 pl-5">
                {showCommentEditor && (
                    <div className="py-3 mb-3">
                        <CommentEditor
                            onSubmit={addReply}
                            isLoading={addReplyLoading}
                            cancelButton
                            cancelButtonFn={() => setShowCommentEditor(false)}
                        />
                    </div>
                )}
                {showReplysSection && (
                    <div className="mt-5 pt-5 pb-3 mb-3">
                        {fetchReplysLoading ? (
                            <div className="flex justify-center">
                                <CircularProgress size={23} />
                            </div>
                        ) : (
                            <>
                                {replys.length > 0 ? (
                                    <>
                                        {replys.map((reply) => (
                                            <Comment
                                                setShowCurrentReplysSectionScop={setShowReplysSection}
                                                setCurrentScopLoading={setFetchReplyLoading}
                                                setCurrentScopCommentsCount={setReplysCount}
                                                setCurrentScopComments={setReplys}
                                                setCommentsCount={setCommentsCount}
                                                setComments={setComments}
                                                key={reply._id}
                                                comment={reply}
                                                postId={postId}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <div className="flex justify-center my-12">
                                        <p className="text-gray-800 font-semibold">No reply have been posted</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
