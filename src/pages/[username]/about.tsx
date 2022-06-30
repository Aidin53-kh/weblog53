import React, { useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { isEmpty } from 'lodash';
import { Edit } from '@mui/icons-material';
import { http } from '../../services';
import { useAppContext } from '../../providers/AppProvider';
import { UserTab } from '../../components/user/Tabs';
import UserPageLayout from '../../layouts/UserPageLayout';
import Button from '../../components/button';
import TextEditor from '../../components/editor';

const About = ({ user }: any) => {
    const context = useAppContext();

    const [editMode, setEditMode] = useState(false);
    const [aboutTemplate, setAboutTemplate] = useState(user.about?.template);

    const [rtl, setRtl] = useState((user.about?.rtl as boolean) || false);
    const editorRef = useRef<HTMLDivElement>(null);

    const handleEditAboutTemplate = async () => {
        try {
            const { data } = await http.patch('/users/about', {
                about: editorRef.current?.textContent?.trim() ? editorRef.current?.innerHTML : '',
                rtl,
            });

            setAboutTemplate(data.about.template);
            context.setUser({ ...context.user, about: data.about });
            setEditMode(false);
        } catch (error) {
            console.log(error);
        }
    };

    const setEditorToEditMode = () => {
        setEditMode(true);
        setTimeout(() => editorRef.current?.focus(), 10);
    };

    return (
        <UserPageLayout activeTab={UserTab.ABOUT} user={user}>
            {!isEmpty(context.user) && context.user.username === user.username ? (
                <>
                    {editMode ? (
                        <>
                            <div className="my-4 flex justify-end gap-4">
                                <Button className="border-green-600 text-green-600" onClick={handleEditAboutTemplate}>
                                    Save
                                </Button>
                                <Button onClick={() => setEditMode(false)}>Cancel</Button>
                            </div>
                            <TextEditor
                                ref={editorRef}
                                rtl={rtl}
                                onDirChange={(data) => setRtl(data.rtl)}
                                defaultTemplate={context.user.about.template}
                            />
                        </>
                    ) : (
                        <div>
                            {context.user.about.template ? (
                                <div>
                                    <div className="mb-8 mt-4 flex justify-end">
                                        <Button onClick={setEditorToEditMode}>Edit</Button>
                                    </div>
                                    <div
                                        className={`${context.user.about?.rtl ? 'rtl' : 'ltr'}`}
                                        dangerouslySetInnerHTML={{ __html: context.user.about.template }}
                                    ></div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-56">
                                    <h2 className="text-2xl font-bold text-neutral-900 mt-12">
                                        Write Some Worlds About Yourself
                                    </h2>
                                    <div className="p-3 rounded-full border mt-6" onClick={setEditorToEditMode}>
                                        <Edit className="text-gray-500" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div>
                    {!!aboutTemplate ? (
                        <div>
                            <div
                                className={`my-12 ${user.about.rtl ? 'rtl' : 'ltr'}`}
                                dangerouslySetInnerHTML={{ __html: aboutTemplate }}
                            ></div>
                        </div>
                    ) : (
                        <div className="text-center my-16">
                            <h2 className="text-2xl font-bold mb-3 text-neutral-900">notthing to show</h2>
                            <p className="text-gray-500 text-sm">write some words about your self</p>
                        </div>
                    )}
                </div>
            )}
        </UserPageLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch(`http://localhost:8000/users/${context.params?.username}`);
    const user = await res.json();

    if (!user.username) return { notFound: true };

    return {
        props: { user },
    };
};

export default About;
