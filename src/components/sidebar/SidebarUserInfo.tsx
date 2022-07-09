import { Fragment, useState } from 'react';
import { Avatar } from '@mui/material';
import { useAppContext } from '../../providers/AppProvider';
import { Prisma, User } from '@prisma/client';

interface SidebarUserInfoProps {
    user: User & { _count: Prisma.UserCountOutputType };
    followersCount?: number;
    myInfo?: boolean;
}

const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({ user, followersCount, myInfo = false }) => {
    return (
        <Fragment>
            <div className="mb-5 mt-10 flex items-center justify-between">
                {user.avatar ? (
                    <Avatar className="w-20 h-20" src={`http://localhost:3000/uploads/avatar/${user.avatar}`} />
                ) : (
                    <Avatar className="w-20 h-20" />
                )}

                <div className="flex gap-8">
                    <div className="text-center border border-white hover:border-gray-200 cursor-pointer py-4 px-1">
                        <h2 className="mb-1 text-lg font-bold">{user._count.followings}</h2>
                        <h3 className="text-sm text-gray-600">Followings</h3>
                    </div>
                    <div className="text-center border border-white hover:border-gray-200 cursor-pointer py-4 px-1">
                        <h2 className="mb-1 text-lg font-bold">{myInfo ? user._count.followers : followersCount}</h2>
                        <h3 className="text-sm text-gray-600">Followers</h3>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold my-4">{user.username}</h2>
                <p className="text-sm text-gray-600 leading-6">{user.bio}</p>
            </div>
        </Fragment>
    );
};

export default SidebarUserInfo;
