import React, { useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { isEmpty } from 'lodash';
import { Edit } from '@mui/icons-material';
import { http } from '../../services';
import { useAppContext } from '../../providers/AppProvider';
import { UserTab } from '../../components/user/Tabs';
import UserPageLayout from '../../layouts/UserPageLayout';
import Button from '../../components/button';
import TextEditor from '../../components/editor';
import { db } from '../../../prisma/db';
import { About, Prisma, User } from '@prisma/client';
import { Pen } from 'react-bootstrap-icons';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = await db.user.findUnique({
        where: { username: context.query.username as string },
        include: {
            _count: true,
            about: true,
        },
    });

    if (!user) return { notFound: true };

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
        },
    };
};

const About = ({ user }: AboutProps) => {
    const context = useAppContext();

    const [editMode, setEditMode] = useState(false);
    const [aboutTemplate, setAboutTemplate] = useState('');
    const [rtl, setRtl] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);

    const handleEditAboutTemplate = async () => {
        try {
            const { data } = await http.patch('/api/authors/edit/about', {
                template: editorRef.current?.textContent?.trim() ? editorRef.current?.innerHTML : '',
                rtl,
            });
console.log(data.about)
            setAboutTemplate(data.about.template);
            setEditMode(false);
        } catch (error) {
            console.log(error);
        }
    };

    const setEditorToEditMode = () => {
        setEditMode(true);
        setTimeout(() => editorRef.current?.focus(), 100);
    };

    useEffect(() => {
        if (user.about) {
            setRtl(user.about.rtl);
            setAboutTemplate(user.about.template);
        }
    }, [user]);

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
                                defaultTemplate={aboutTemplate}
                            />
                        </>
                    ) : (
                        <div>
                            {aboutTemplate ? (
                                <div>
                                    <div className="mb-8 mt-4 flex justify-end">
                                        <Button onClick={setEditorToEditMode}>Edit</Button>
                                    </div>
                                    <div
                                        className={`${rtl ? 'rtl' : 'ltr'}`}
                                        dangerouslySetInnerHTML={{ __html: aboutTemplate }}
                                    ></div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-56">
                                    <h2 className="text-xl font-semibold text-neutral-900 mt-12">
                                        Write Some Words About Yourself
                                    </h2>
                                    <div className="p-3 rounded-full border mt-6" onClick={setEditorToEditMode}>
                                        <Pen className="text-gray-600" />
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
                                className={`my-12 ${rtl ? 'rtl' : 'ltr'}`}
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

interface AboutProps {
    user: User & { about: About; _count: Prisma.UserCountOutputType };
}

export default About;
