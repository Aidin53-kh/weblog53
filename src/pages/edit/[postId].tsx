import React, { useState, useRef, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
} from '@mui/material';
import useSWR from 'swr';
import { Container, Button, Sidebar } from '../../components/sidebar';
import TextEditor from '../../components/editor';
import { useAuth } from '../../utils/auth';
import { editPost } from '../../services/post/editPost';
import SmallPost from '../../components/post/card/SmallPost';
import { http } from '../../services';

export default function EditPost({ post }: any) {
    const router = useRouter();
    const { data, error } = useSWR(`/posts/private`, (url) => http.get(url).then((res) => res.data));

    const [openPublishDialog, setOpenPublishDialog] = useState(false);
    const [rtl, setRtl] = useState(post.rtl || false);
    const [loading, setLoading] = useState<boolean | 'publishing' | 'redirecting'>(false);
    const [postImages, setPostImages] = useState<{ [key: string]: File }>({});

    const [tags, setTags] = useState(post.tags.join(','));
    const [isPublic, setIsPublic] = useState(post.isPublic);

    const editorRef = useRef<HTMLDivElement>(null);

    const handleRePublish = async () => {
        setLoading('publishing');
        try {
            const { error, post: $post } = await editPost({
                editor: editorRef.current,
                rtl,
                tags,
                postId: post._id,
                postImages,
                isPublic,
            });
            if (error) {
                setLoading(false);
                console.log(error);
            } else {
                setLoading('redirecting');
                router.push(`/posts/${post._id}`);
                console.log('POST EDITED: ', $post);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => editorRef.current?.focus(), []);

    return (
        <>
            <div className="w-full mb-12 child:leading-8">
                <Container>
                    <TextEditor
                        ref={editorRef}
                        rtl={rtl}
                        onDirChange={(data) => setRtl(data.rtl)}
                        onUploadImage={(file, objectUrl) => setPostImages({ ...postImages, [objectUrl]: file })}
                        defaultTemplate={post.template}
                    />
                </Container>

                <Dialog fullWidth open={openPublishDialog} onClose={() => setOpenPublishDialog(false)}>
                    <DialogTitle>Publish</DialogTitle>
                    <DialogContent className="py-6">
                        <p className="text-gray-500 text-sm mb-2">
                            split your tags with ',' charecter example: 'tag1, tag2, ...'
                        </p>
                        <TextField
                            fullWidth
                            placeholder="write post tags"
                            onChange={(e) => setTags(e.target.value)}
                            value={tags}
                            name="postTag"
                        />
                        <FormControlLabel
                            control={<Checkbox defaultChecked={!isPublic} onChange={(_, e) => setIsPublic(!e)} />}
                            label="Private"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRePublish} disabled={!!loading}>
                            {!!loading ? (
                                <span>
                                    {loading === 'publishing' && 'Publishing'}
                                    {loading === 'redirecting' && 'Redirecting'}
                                    <CircularProgress size={20} />
                                </span>
                            ) : (
                                <span>publish</span>
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Sidebar className="py-6">
                <Button fullWidth onClick={() => setOpenPublishDialog(true)}>
                    publish
                </Button>
                <div>
                    <h2 className="text-lg font-semibold pt-8 mb-6">Your Private Posts</h2>
                    {!error ? (
                        <>
                            {data ? (
                                <>
                                    {data.posts.map((p: any) => (
                                        <SmallPost
                                            post={p}
                                            showUserInfo={false}
                                            showDeleteButton
                                            showEditButton
                                            showLeftLine={p._id === post._id}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className="text-center mt-12">
                                    <CircularProgress size={20} />
                                </div>
                            )}
                        </>
                    ) : (
                        <h3 className="px-4 my-12 text-center">error on get private posts</h3>
                    )}
                </div>
            </Sidebar>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch(`http://localhost:8000/posts/${context.params?.postId}`);
    const post = await res.json();

    const { username } = useAuth(context);
    if (!post || post.user.username !== username) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post,
        },
    };
};
