import type { Dispatch, SetStateAction, FC } from 'react';
import { Dialog, Tab, Tabs, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { TabPanel } from '../sidebar';

interface LoginAndRegisterDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
}

const LoginAndRegisterDialog: FC<LoginAndRegisterDialogProps> = ({ open, setOpen, page, setPage }) => {
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                className: 'flex px-4 pt-4 xl:pt-20 bg-blue-400',
            }}
        >
            <div className="max-w-xl mx-auto backdrop-blur-xl bg-white shadow-lg p-4 rounded-lg">
                <div className="flex items-center">
                    <IconButton onClick={() => setOpen(false)}>
                        <ArrowBack />
                    </IconButton>
                    <h2 className="text-2xl ml-6 mb-1 font-extrabold">{page === 0 ? 'Login' : 'Register'}</h2>
                </div>
                <Tabs onChange={(_, pageIndex) => setPage(pageIndex)} value={page} className="my-8">
                    <Tab className="w-1/2 font-semibold" label="Login" />
                    <Tab className="w-1/2 font-semibold" label="Register" />
                </Tabs>

                <TabPanel value={page} index={0}>
                    <LoginForm />
                </TabPanel>
                <TabPanel value={page} index={1}>
                    <RegisterForm />
                </TabPanel>
            </div>
        </Dialog>
    );
};

export default LoginAndRegisterDialog;
