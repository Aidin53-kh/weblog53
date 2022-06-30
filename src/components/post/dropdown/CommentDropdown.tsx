import { CircularProgress, ListItem, Menu } from '@mui/material';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { http } from '../../../services';
import { IComment } from '../comment/types';

interface CommentDropdownProps {
    open: HTMLElement | null;
    setOpen: Dispatch<SetStateAction<HTMLElement | null>>;
    postId?: string;
    comment: IComment;
    deleteComment: () => void;
    deleteReply: () => void;
    deleteLoading: boolean;
    setEditMode: Dispatch<SetStateAction<boolean>>
}

export const CommentDropdown: FC<CommentDropdownProps> = ({
    open,
    setOpen,
    comment,
    deleteComment,
    deleteReply,
    deleteLoading,
    setEditMode,
}) => {
    return (
        <Menu open={!!open} onClose={() => setOpen(null)} anchorEl={open}>
            {comment.roll === 'Comment' ? (
                <>
                    <ListItem onClick={deleteComment} disabled={deleteLoading} className="text-sm">
                        {deleteLoading ? <CircularProgress size={20} /> : 'delete comment'}
                    </ListItem>
                    <ListItem
                        onClick={() => {
                            setEditMode(true);
                            setOpen(null);
                        }}
                        className="text-sm"
                    >
                        edit comment
                    </ListItem>
                </>
            ) : (
                <>
                    <ListItem onClick={deleteReply} disabled={deleteLoading} className="text-sm">
                        {deleteLoading ? <CircularProgress size={20} /> : 'delete reply'}
                    </ListItem>
                    <ListItem
                        onClick={() => {
                            setEditMode(true);
                            setOpen(null);
                        }}
                        className="text-sm"
                    >
                        edit reply
                    </ListItem>
                </>
            )}
        </Menu>
    );
};
