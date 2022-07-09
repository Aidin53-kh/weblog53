import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { http } from '../../../services';
import SmallPost from '../card/SmallPost';

interface RecommendedPostsProps {
    postId: string;
}

export const RecommendedPosts: React.FC<RecommendedPostsProps> = ({ postId }) => {
    const { query, pathname } = useRouter();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSimilarPosts = async () => {
        setLoading(true);
        try {
            const { data } = await http.get(`/api/posts/${postId}/similar`);
            setPosts(data.posts);
        } catch (error: any) {
            console.log(error.response);
            alert('error to get semilar posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSimilarPosts();
    }, [query, pathname]);

    return (
        <div className="mt-12">
            {posts.length > 0 && <h2 className="text-lg font-semibold mb-6">Recommended For You</h2>}
            {!loading ? (
                <>
                    {posts.map((post: any) => (
                        <SmallPost post={post} key={post.id} />
                    ))}
                </>
            ) : (
                <div className="text-center mt-20">
                    <CircularProgress size={20} />
                </div>
            )}
        </div>
    );
};
