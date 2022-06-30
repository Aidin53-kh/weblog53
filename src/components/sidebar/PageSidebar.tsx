import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import { isEmpty } from 'lodash';
import { Button, Sidebar, SidebarSearch, SidebarUserInfo } from '.';
import { useAppContext } from '../../providers/AppProvider';
import { http } from '../../services';
import { Pages } from '../auth/types';

const PageSidebar = ({ user }: any) => {
    const router = useRouter();
    const context = useAppContext();

    const [followersCount, setFollowersCount] = useState(user?.followers?.length || 0); // for user sidebar
    const [isFollowed, setIsFollowed] = useState(false); // for user sidebar

    const handleFollow = async () => {
        try {
            const { data } = await http.get(`/users/${user.username}/follow`);

            context.setUser({ ...context.user, followings: data.user.followings });
            setFollowersCount(data.targetUser.followersCount);
            setIsFollowed(true);
        } catch (error: any) {
            if (error.response.status === 401) {
                context.openLoginAndRegisterDialog(Pages.LOGIN);
            }
        }
    };

    const handleUnFollow = async () => {
        try {
            const { data } = await http.get(`/users/${user.username}/unfollow`);

            context.setUser({ ...context.user, followings: data.user.followings });
            setFollowersCount(data.targetUser.followersCount);
            setIsFollowed(false);
        } catch (error: any) {
            if (error.response.status === 401) {
                context.openLoginAndRegisterDialog(Pages.LOGIN);
            }
        }
    };

    const hanldeSearch = (value: string) => {
        const d = new URLSearchParams();
        router.push({
            pathname: `${router.pathname.replace('[username]', router.query.username as string)}`,
            query: { search: value },
        });
    };

    useEffect(() => {
        if (!context.authLoading && !isEmpty(context.user) && context.user.username !== user.username) {
            if (context.user.followings.map((f: any) => f.username).includes(user.username)) {
                setIsFollowed(true);
            }
        }
    }, [context.authLoading, context.user]);

    useEffect(() => {
        if (isEmpty(context.user)) setIsFollowed(false);
    }, [context.user]);

    return (
        <Sidebar>
            {context.authLoading && (
                <div className="text-center h-full">
                    <CircularProgress />
                </div>
            )}

            {!context.authLoading && (
                <>
                    {context.isAuthenticate && context.user.username === user.username ? (
                        // if login and is my page
                        <>
                            <div className="flex items-center justify-end gap-4 pt-8">
                                <Link href="/write">
                                    <Button className="w-full">Write</Button>
                                </Link>
                                <Link href="/settings">
                                    <Button className="w-full">Settings</Button>
                                </Link>
                            </div>

                            <SidebarSearch onSearch={(value) => hanldeSearch(value)} />
                            <SidebarUserInfo user={user} myInfo />
                        </>
                    ) : (
                        // if not login or is not my page
                        <>
                            <div className="flex items-center justify-end gap-4 mt-8">
                                {isFollowed ? (
                                    <Button className="w-full" onClick={handleUnFollow}>
                                        UnFollow
                                    </Button>
                                ) : (
                                    <Button className="w-full" onClick={handleFollow}>
                                        Follow
                                    </Button>
                                )}
                            </div>

                            <SidebarSearch onSearch={(value) => hanldeSearch(value)} />
                            <SidebarUserInfo user={user} followersCount={followersCount} />
                        </>
                    )}
                </>
            )}
        </Sidebar>
    );
};

export default PageSidebar;
