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
import TextEditor from '../../components/editor';
import { Button, Container, Sidebar } from '../../components/sidebar';
import { withAuth } from '../../utils/auth';
import { createPost } from '../../services/post/createPost';
import useSWR from 'swr';
import SmallPost from '../../components/post/card/SmallPost';
import { http } from '../../services';
import SidebarWriteAndEditPost from '../../components/sidebar/SidebarWriteAndEditPost';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { isAuthentcate, currentUser } = withAuth(context);

    if (!isAuthentcate) return { notFound: true };

    return {
        props: {
            currentUser,
        },
    };
};

export default function Write({ currentUser }: { currentUser: { username: string; id: string } }) {
    const router = useRouter();
    const { data, error } = useSWR(`/api/posts/private`, (url) => http.get(url).then((res) => res.data));

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
            const { error, post } = await createPost({
                editor: editorRef?.current,
                tags,
                rtl,
                postImages,
                isPublic,
                authorId: currentUser.id,
            });
            if (error) {
                setLoading(false);
                console.log(error);
            } else {
                setLoading('redirecting');
                router.push(`/posts/${post.id}`);
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
            <SidebarWriteAndEditPost onPublish={() => setOpenPublishDialog(true)} />
        </>
    );
}
