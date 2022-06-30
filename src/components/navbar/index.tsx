import Link from 'next/link';
import { Avatar, CircularProgress } from '@mui/material';
import { isEmpty } from 'lodash';
import { PostAddOutlined } from '@mui/icons-material';
import { Bookmarks, HouseDoor, Gear, BoxArrowInLeft, BoxArrowRight, Pen } from 'react-bootstrap-icons';

import { useAppContext } from '../../providers/AppProvider';
import { Pages } from '../auth/types';

const Navbar = () => {
    const { user, logout, authLoading, openLoginAndRegisterDialog } = useAppContext();
    const openLoginDialog = () => openLoginAndRegisterDialog(Pages.LOGIN);

    return (
        <nav className="max-w-[75px] border-r xl:max-w-[110px] hidden md:flex max-h-screen min-h-screen xl:pl-8 sticky top-0 items-center flex-col justify-between">
            <header className="mt-5 p-4">
                <img src="/logo.png" alt="logo" loading="lazy" />
            </header>

            <main className="flex flex-col text-gray-500 py-8 gap-8">
                <div className="flex flex-col gap-10">
                    <Link href="/">
                        <a>
                            <HouseDoor />
                        </a>
                    </Link>
                    {!isEmpty(user) ? (
                        <>
                            <Link href={`/${user.username}/saved`}>
                                <a>
                                    <Bookmarks />
                                </a>
                            </Link>
                            <Link href={`/${user.username}`}>
                                <a>
                                    <Gear />
                                </a>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div onClick={openLoginDialog}>
                                <Bookmarks className="cursor-pointer" />
                            </div>
                            <div onClick={openLoginDialog}>
                                <Gear className="cursor-pointer" />
                            </div>
                            <div onClick={openLoginDialog}>
                                <BoxArrowInLeft className="cursor-pointer w-[23px] h-[23px]" />
                            </div>
                        </>
                    )}
                    {!isEmpty(user) && (
                        <div onClick={logout}>
                            <BoxArrowRight />
                        </div>
                    )}
                </div>
                <hr />
                <div className="flex flex-col gap-10text-gray-800">
                    {!isEmpty(user) ? (
                        <Link href={`/write`}>
                            <a>
                                <Pen />
                            </a>
                        </Link>
                    ) : (
                        <div onClick={openLoginDialog}>
                            <Pen className="cursor-pointer" />
                        </div>
                    )}
                </div>
            </main>

            <footer className="mb-5">
                {authLoading ? (
                    <div className="text-center">
                        <CircularProgress size={20} />
                    </div>
                ) : (
                    <>
                        {!isEmpty(user) ? (
                            <>
                                {!!user?.avatar ? (
                                    <Link href={`/${user.username}`}>
                                        <a>
                                            <Avatar src={`http://localhost:8000/public/avatars/${user.avatar}`} />
                                        </a>
                                    </Link>
                                ) : (
                                    <Avatar />
                                )}
                            </>
                        ) : (
                            <Avatar onClick={openLoginDialog} />
                        )}
                    </>
                )}
            </footer>
        </nav>
    );
};

export default Navbar;
