import React, { useState, useRef, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Post, User } from '@prisma/client';
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
import { db } from '../../../prisma/db';
import { withAuth } from '../../utils/auth';
import TextEditor from '../../components/editor';
import SidebarWriteAndEditPost from '../../components/sidebar/SidebarWriteAndEditPost';
import { Container, Button } from '../../components/sidebar';
import { editPost } from '../../services/post/editPost';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const post = await db.post.findUnique({
        where: { id: context.query.postId as string },
        include: {
            author: true
        }
    });

    const { currentUser } = withAuth(context);
    if (!post || post.author.id !== currentUser.id) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post: JSON.parse(JSON.stringify(post)),
        },
    };
};

const EditPost = ({ post }: EditPostProps) => {
    const router = useRouter();

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
                postId: post.id,
                postImages,
                isPublic,
            });
            if (error) {
                setLoading(false);
                console.log(error);
            } else {
                setLoading('redirecting');
                router.push(`/posts/${post.id}`);
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
                            className='my-3'
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
            <SidebarWriteAndEditPost onPublish={() => setOpenPublishDialog(true)} />
        </>
    );
}

interface EditPostProps {
    post: Post & { author: User }
}

export default EditPost;
