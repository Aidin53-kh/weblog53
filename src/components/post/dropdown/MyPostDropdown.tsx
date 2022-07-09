import type { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { Menu, MenuItem } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { http } from '../../../services';
import { deletePost } from '../../../services/post/deletePost';

interface MyPostDropdownProps {
    open: null | HTMLElement;
    setOpen: Dispatch<SetStateAction<null | HTMLElement>>;
    postId: string;
}

export const MyPostDropdown: React.FC<MyPostDropdownProps> = ({ open, setOpen, postId }) => {
    return (
        <Menu
            elevation={0}
            open={!!open}
            anchorEl={open}
            onClose={() => setOpen(null)}
            PaperProps={{
                className: 'border rounded-lg',
            }}
        >
            <Link href={`/edit/${postId}`}>
                <a>
                    <MenuItem className="pl-3 pr-10">
                        <Edit fontSize="small" className="text-gray-700" />
                        <span className="ml-3">Edit</span>
                    </MenuItem>
                </a>
            </Link>
            <MenuItem className="pl-3 pr-10" onClick={() => deletePost(postId)}>
                <Delete fontSize="small" className="text-gray-700" />
                <span className="ml-3">Delete</span>
            </MenuItem>
        </Menu>
    );
};
