import { Fragment, useState } from 'react';
import Link from 'next/link';
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { isEmpty } from 'lodash';
import { useAppContext } from '../../providers/AppProvider';

interface SidebarUserInfoProps {
    user: any;
    followersCount?: number;
    myInfo?: boolean;
}

const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({ user, followersCount, myInfo = false }) => {
    const context = useAppContext();

    const [followDialog, setFollowDialog] = useState(false);
    const [mode, setMode] = useState<'followings' | 'followers'>('followings');

    return (
        <Fragment>
            <div className="mb-5 mt-10 flex items-center justify-between">
                {myInfo ? (
                    <>
                        {!isEmpty(context.user) && context.user.avatar ? (
                            <Avatar className="w-20 h-20" src={`http://localhost:8000/public/avatars/${context.user.avatar}`} />
                        ) : (
                            <Avatar className="w-20 h-20" />
                        )}
                    </>
                ) : (
                    <>
                        {user.avatar ? (
                            <Avatar className="w-20 h-20" src={`http://localhost:8000/public/avatars/${user.avatar}`} />
                        ) : (
                            <Avatar className="w-20 h-20" />
                        )}
                    </>
                )}

                <div className="flex gap-8">
                    <div
                        className="text-center border border-white hover:border-gray-200 cursor-pointer py-4 px-1"
                        onClick={() => {
                            setMode('followings');
                            setFollowDialog(true);
                        }}
                    >
                        <h2 className="mb-1 text-lg font-bold">{user.followings.length}</h2>
                        <h3 className="text-sm text-gray-600">Followings</h3>
                    </div>
                    <div
                        className="text-center border border-white hover:border-gray-200 cursor-pointer py-4 px-1"
                        onClick={() => {
                            setMode('followers');
                            setFollowDialog(true);
                        }}
                    >
                        <h2 className="mb-1 text-lg font-bold">{myInfo ? user.followers.length : followersCount}</h2>
                        <h3 className="text-sm text-gray-600">Followers</h3>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold my-4">{user.username}</h2>
                <p className="text-sm text-gray-600 leading-6">{user.bio}</p>
            </div>

            <Dialog fullWidth open={followDialog} onClose={() => setFollowDialog(false)}>
                <DialogTitle>{mode}</DialogTitle>
                <List>
                    {user[mode].map(($user: any) => (
                        <ListItem key={$user._id} className={`${context.user.username === $user.username && 'bg-green-50'}`}>
                            <ListItemAvatar>
                                {$user.avatar ? (
                                    <Avatar src={`http://localhost:8000/public/avatars/${$user.avatar}`} />
                                ) : (
                                    <Avatar />
                                )}
                            </ListItemAvatar>
                            <ListItemText secondary={<p>{$user.bio}</p>}>
                                <Link href={`/${$user.username}`}>
                                    <a>{$user.username}</a>
                                </Link>
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </Fragment>
    );
};

export default SidebarUserInfo;
