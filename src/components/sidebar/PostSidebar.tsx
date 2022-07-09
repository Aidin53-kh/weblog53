import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import { isEmpty } from 'lodash';
import { Button, Sidebar, SidebarSearch, SidebarUserInfo } from '.';
import { useAppContext } from '../../providers/AppProvider';
import { http } from '../../services';
import { RecommendedPosts } from '../post/details/RecommendedPosts';

interface PostSidebarProps {
    user: any;
    postId?: string;
    showRecommendedPosts?: boolean;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ user, postId, showRecommendedPosts = false }) => {
    const router = useRouter();
    const context = useAppContext();

    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isFollowedLoading, setIsFollowedLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);

    const handleFollow = async () => {
        setFollowLoading(true);
        try {
            const { data } = await http.get(`/api/authors/${user.id}/follow`);
            setFollowersCount(data.user._count.followers);
            setIsFollowed(true);
        } catch (error: any) {
            if (error.response.status === 401) {
                alert('auth require');
            }
        } finally {
            setFollowLoading(false);
        }
    };

    const handleUnFollow = async () => {
        setFollowLoading(true);
        try {
            const { data } = await http.get(`/api/authors/${user.id}/unfollow`);
            setFollowersCount(data.user._count.followers);
            setIsFollowed(false);
        } catch (error: any) {
            if (error.response.status === 401) {
                alert('auth require');
            }
        } finally {
            setFollowLoading(false);
        }
    };

    const hanldeSearch = (value: string) => {
        router.push({
            pathname: `/${user.username}`,
            query: { search: value },
        });
    };

    const handleCheckIsFollowed = async () => {
        try {
            const { data } = await http.get(`/api/authors/${user.id}/isFollowed`);
            setIsFollowed(data.isFollowed);
        } catch (error) {
            console.log(error);
        } finally {
            setIsFollowedLoading(false);
        }
    };

    useEffect(() => {
        setFollowersCount(user._count.followers);
        handleCheckIsFollowed();
    }, [user]);

    useEffect(() => {
        if (isEmpty(context.user)) setIsFollowed(false);
    }, [context.user]);

    return (
        <Sidebar>
            {context?.user?.username === user.username ? (
                <div className="flex items-center justify-end gap-4 pt-8">
                    <Link href="/write">
                        <Button className="w-full">Write</Button>
                    </Link>
                    <Link href="/settings">
                        <Button className="w-full">Settings</Button>
                    </Link>
                </div>
            ) : (
                <div className="flex items-center justify-end gap-4 mt-8">
                    {!isFollowedLoading && !followLoading ? (
                        <>
                            {isFollowed ? (
                                <Button className="w-full" onClick={handleUnFollow}>
                                    UnFollow
                                </Button>
                            ) : (
                                <Button className="w-full" onClick={handleFollow}>
                                    Follow
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button className="w-full disabled:border-blue-300 py-[8px]" disabled>
                            <CircularProgress size={17} />
                        </Button>
                    )}
                </div>
            )}

            <SidebarSearch onSearch={(value) => hanldeSearch(value)} />
            <SidebarUserInfo user={user} myInfo={context?.user?.username === user.username} followersCount={followersCount} />
            {showRecommendedPosts && postId && <RecommendedPosts postId={postId} />}
        </Sidebar>
    );
};

export default PostSidebar;
