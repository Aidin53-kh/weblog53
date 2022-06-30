import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar, CircularProgress, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import useSWR from 'swr';
import { useAppContext } from '../../providers/AppProvider';
import { Pages } from '../auth/types';
import Button from '../button';
import SidebarSearch from './SidebarSearch';
import SidebarContainer from './SidebarContainer';
import { http } from '../../services';

const AppSidebar: React.FC = () => {
    const router = useRouter();
    const context = useAppContext();

    const { data, error } = useSWR('/users/getTopUsers', (url) => http.get(url).then((res) => res.data));

    const hanldeSearch = (value: string) => {
        router.push({
            pathname: router.pathname,
            query: { search: value },
        });
    };

    return (
        <SidebarContainer>
            <div className="flex items-center justify-end gap-4 pt-6">
                <Button className="w-full" onClick={() => context.openLoginAndRegisterDialog(Pages.LOGIN)}>
                    Login
                </Button>
                <Button className="w-full" onClick={() => context.openLoginAndRegisterDialog(Pages.REGISTER)}>
                    Register
                </Button>
            </div>
            <SidebarSearch onSearch={(value) => hanldeSearch(value)} />

            <h2 className="text-xl ml-2 mb-2 pt-3 font-semibold text-neutral-900">Top Users</h2>
            {!error ? (
                <>
                    {data ? (
                        <>
                            <List>
                                {data.users.map(($user: any) => (
                                    <Link href={`/${$user.username}`} key={$user._id}>
                                        <a>
                                            <ListItem
                                                key={$user._id}
                                                className={`px-2 py-1 mb-3 hover:bg-gray-100 rounded-full ${
                                                    context.user.username === $user.username && 'bg-blue-50'
                                                }`}
                                            >
                                                <ListItemAvatar>
                                                    {$user.avatar ? (
                                                        <Avatar src={`http://localhost:8000/public/avatars/${$user.avatar}`} />
                                                    ) : (
                                                        <Avatar />
                                                    )}
                                                </ListItemAvatar>
                                                <ListItemText secondary={<p className="truncate">{$user.bio}</p>}>
                                                    {$user.username}
                                                </ListItemText>
                                            </ListItem>
                                        </a>
                                    </Link>
                                ))}
                            </List>
                            <div className="text-blue-500 text-sm text-center">
                                <Link href="/">View More</Link>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-screen text-center mt-32">
                            <CircularProgress size={20} />
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-screen text-center mt-44">
                    <h2 className="text-2xl">faild to get users</h2>
                </div>
            )}

            <div className="flex items-center justify-center gap-5 py-3 my-16">
                <div className="uppercase text-gray-500 text-xs">Home</div>
                <div className="uppercase text-gray-500 text-xs">About</div>
                <div className="uppercase text-gray-500 text-xs">Medium</div>
                <div className="uppercase text-gray-500 text-xs">Blog</div>
                <div className="uppercase text-gray-500 text-xs">Help</div>
                <div className="uppercase text-gray-500 text-xs">Status</div>
            </div>
        </SidebarContainer>
    );
};

export default AppSidebar;
