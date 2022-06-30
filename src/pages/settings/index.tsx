import { Avatar, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import { Container, Button } from '../../components/sidebar';
import Protected from '../../components/auth/Protected';
import { useAppContext } from '../../providers/AppProvider';
import { SettingsProvider, useSettingsContext } from '../../providers/SettingsProvider';

const Settings = () => {
    const { user } = useAppContext();
    const settings = useSettingsContext();

    return (
        <Container className="my-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">About You</h1>
            <hr />
            <Formik initialValues={{ username: user.username }} onSubmit={settings.handleEditUsername}>
                {({ handleChange, isSubmitting, values }) => (
                    <Form className="my-12">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Name</h2>
                            {settings.usernameEditMode ? (
                                <div className="flex gap-3">
                                    <Button
                                        disabled={isSubmitting}
                                        className="text-green-600 disabled:opacity-40 border-green-600"
                                        type="submit"
                                    >
                                        {isSubmitting ? <CircularProgress size={20} className="text-green-700" /> : 'Save'}
                                    </Button>
                                    <Button onClick={() => settings.setUsernameEditMode(false)}>Cancel</Button>
                                </div>
                            ) : (
                                <Button onClick={settings.setUsernameInputToEditMode}>Edit</Button>
                            )}
                        </div>
                        <input
                            ref={settings.usernameInputRef}
                            autoComplete="off"
                            name="username"
                            disabled={!settings.usernameEditMode || isSubmitting}
                            onChange={handleChange}
                            defaultValue={user.username}
                            className="w-[450px] outline-none py-2 border-b disabled:bg-white"
                        />
                        <div className="flex items-center my-5">
                            <span className="mr-12 font-semibold">URL</span>
                            <p className="text-neutral-800">
                                http://localhost:8000/<span className="font-semibold">{values.username}</span>
                            </p>
                        </div>
                        <p className="text-sm text-gray-500">
                            Your name appears on your Profile page, as your byline, and in your responses. It is a required field.
                        </p>
                    </Form>
                )}
            </Formik>

            <Formik initialValues={{ bio: user.bio }} onSubmit={settings.handleEditBio}>
                {({ handleChange, isSubmitting }) => (
                    <Form className="my-12">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
                            {settings.bioEditMode ? (
                                <div className="flex gap-3">
                                    <Button
                                        disabled={isSubmitting}
                                        className="text-green-600 disabled:opacity-40 border-green-600"
                                        type="submit"
                                    >
                                        {isSubmitting ? <CircularProgress size={20} className="text-green-700" /> : 'Save'}
                                    </Button>
                                    <Button onClick={() => settings.setBioEditMode(false)}>Cancel</Button>
                                </div>
                            ) : (
                                <Button onClick={settings.setBioInputToEditMode}>Edit</Button>
                            )}
                        </div>
                        <input
                            ref={settings.bioInputRef}
                            autoComplete="off"
                            name="bio"
                            disabled={!settings.bioEditMode || isSubmitting}
                            defaultValue={user.bio}
                            onChange={handleChange}
                            className="w-[450px] outline-none py-2 border-b disabled:bg-white"
                            placeholder="Enter some words about your self"
                        />
                        <p className="text-sm text-gray-500 my-5">
                            Your short bio appears on your Profile and next to your stories. Max 160 characters.
                        </p>
                    </Form>
                )}
            </Formik>

            <section>
                <h2 className="text-lg font-semibold text-gray-900">Photo</h2>
                <div className="flex justify-between items-center gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">
                            Your photo appears on your Profile page and with your stories across Medium.
                        </p>
                        {user.avatar && (
                            <>
                                {!settings.loadingAvatar && (
                                    <>
                                        {settings.deleteAvatarLoading ? (
                                            <p className="text-red-400 text-sm">Deleteing...</p>
                                        ) : (
                                            <button className="text-red-500 text-sm" onClick={settings.handleDeleteAvatar}>
                                                Delete Profile Image
                                            </button>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <label htmlFor="username" className="cursor-pointer rounded-full">
                        <Avatar
                            className="w-20 h-20 border"
                            src={!settings.loadingAvatar ? `http://localhost:8000/public/avatars/${user.avatar}` : undefined}
                        >
                            {settings.loadingAvatar ? <CircularProgress className='text-white' size={30} /> : null}
                        </Avatar>
                    </label>
                </div>
                <input id="username" onChange={settings.handleEditAvatar} name="username" type="file" className="hidden" />
            </section>
        </Container>
    );
};

Settings.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <Protected>
            <SettingsProvider>{page}</SettingsProvider>
        </Protected>
    );
};

export default Settings;
