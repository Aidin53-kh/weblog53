import type { Dispatch, SetStateAction } from 'react';
import { Menu, MenuItem } from '@mui/material';

interface UserPostDropdownProps {
    open: null | HTMLElement;
    setOpen: Dispatch<SetStateAction<null | HTMLElement>>;
}

export const UserPostDropdown: React.FC<UserPostDropdownProps> = ({ open, setOpen }) => {
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
            <MenuItem className="pl-3 pr-10">
                <span className="ml-3">Report This User</span>
            </MenuItem>
        </Menu>
    );
};
