import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { Avatar } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { formatDate } from '../../../utils/date';

interface PostDetailsHeaderProps {
    post: any;
    setOpenDropdown: Dispatch<SetStateAction<HTMLElement | null>>;
}

export const PostDetailsHeader: React.FC<PostDetailsHeaderProps> = ({ post, setOpenDropdown }) => {
    return (
        <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
                <Link href={`/${post.author.username}`}>
                    <a>
                        {post.author.avatar ? (
                            <Avatar className="h-12 w-12" src={`https://weblog53.netlify.app/uploads/avatars/${post.author.avatar}`} />
                        ) : (
                            <Avatar className="h-12 w-12" />
                        )}
                    </a>
                </Link>
                <div>
                    <Link href={`/${post.author.username}`}>
                        <a>
                            <h4 className="text-lg">{post.author.username}</h4>
                        </a>
                    </Link>
                    <div className="flex items-center gap-2">
                        <p className="text-sm my-1 text-gray-500">{formatDate(post.createdAt)}</p>
                        <span className="font-bold text-gray-400 ">·</span>
                        <p className="text-sm my-1 text-gray-500">{post.readingTime} min read</p>
                    </div>
                </div>
            </div>
            <MoreHoriz className="text-gray-500" onClick={(e) => setOpenDropdown(e.target as HTMLElement)} />
        </div>
    );
};
