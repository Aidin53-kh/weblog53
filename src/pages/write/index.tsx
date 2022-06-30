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
    FormControl,
    FormControlLabel,
    TextField,
} from '@mui/material';
import useSWR from 'swr';
import TextEditor from '../../components/editor';
import { Button, Container, Sidebar } from '../../components/sidebar';
import SmallPost from '../../components/post/card/SmallPost';
import { withAuth } from '../../utils/auth';
import { createPost } from '../../services/post/createPost';
import { http } from '../../services';

export default function Write() {
    const router = useRouter();
    const { data, error } = useSWR(`/posts/private`, (url) => http.get(url).then((res) => res.data));

    const [openPublishDialog, setOpenPublishDialog] = useState(false);
    const [rtl, setRtl] = useState(false);
    const [loading, setLoading] = useState<boolean | 'publishing' | 'redirecting'>(false);
    const [postImages, setPostImages] = useState<{ [key: string]: File }>({});

    // dialog states
    const [tags, setTags] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const editorRef = useRef<HTMLDivElement>(null);

    const handlePublish = async () => {
        setLoading('publishing');
        try {
            const { error, post } = await createPost({ editor: editorRef?.current, tags, rtl, postImages, isPublic });
            if (error) {
                setLoading(false);
                console.log(error);
            } else {
                setLoading('redirecting');
                router.push(`/posts/${post._id}`);
                console.log('POST CREATED: ', post);
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
                        defaultTemplate='<h2 class="text-3xl font-bold mb-6"><br /></h2>'
                    />
                </Container>

                <Dialog fullWidth open={openPublishDialog} onClose={() => setOpenPublishDialog(false)}>
                    <DialogTitle>RePublish</DialogTitle>
                    <DialogContent className="py-6">
                        <p className="text-gray-500 text-sm">split your tags with ',' charecter example: 'tag1, tag2, ...'</p>
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
                        <Button onClick={handlePublish} disabled={!!loading}>
                            {!!loading ? (
                                <span className="flex items-center gap-4">
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
                                    {data.posts.map((post: any) => (
                                        <SmallPost
                                            key={post._id}
                                            post={post}
                                            showUserInfo={false}
                                            showEditButton
                                            showDeleteButton
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
    const { isAuthentcate, username } = withAuth(context);

    if (!isAuthentcate) return { notFound: true };

    return {
        props: {
            username,
        },
    };
};
