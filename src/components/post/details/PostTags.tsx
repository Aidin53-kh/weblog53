import { Chip } from '@mui/material';

interface PostTagsProps {
    tags: string[];
}

export const PostTags: React.FC<PostTagsProps> = ({ tags }) => {
    return (
        <div className="flex gap-4 mt-16">
            {tags.map((tag: string) => (
                <Chip label={tag} className="bg-gray-100" />
            ))}
        </div>
    );
};
