import React, { useContext, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { http } from '../services';
import { useAppContext } from './AppProvider';
import { useRouter } from 'next/router';
import { DEFAULT_SETTINGS_CONTEXT_VALUES, SettingsContext } from './types';

export const settingsContext = React.createContext<SettingsContext>(DEFAULT_SETTINGS_CONTEXT_VALUES);

export const SettingsProvider: React.FC = ({ children }) => {
    const router = useRouter();
    const context = useAppContext();

    const [usernameEditMode, setUsernameEditMode] = useState(false);
    const [bioEditMode, setBioEditMode] = useState(false);

    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [deleteAvatarLoading, setDeleteAvatarLoading] = useState(false);

    const usernameInputRef = useRef<HTMLInputElement>(null);
    const bioInputRef = useRef<HTMLInputElement>(null);

    const setUsernameInputToEditMode = () => {
        setUsernameEditMode(true);
        setTimeout(() => usernameInputRef.current?.focus(), 100);
    };

    const setBioInputToEditMode = () => {
        setBioEditMode(true);
        setTimeout(() => bioInputRef.current?.focus(), 100);
    };

    const handleEditUsername = async (values: any) => {
        try {
            const { data } = await http.post('/users/username', values);
            setUsernameEditMode(false);
            context.setUser({ ...context.user, username: data.username });
            router.push(`/${data.username}`);
        } catch (error: any) {
            if (error.response.status === 409) {
                alert(`user ${values.username} is exist`);
            }
        }
    };

    const handleEditBio = async (values: any) => {
        try {
            const { data } = await http.post('/users/bio', values);
            setBioEditMode(false);
            context.setUser({ ...context.user, bio: data.bio });
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        if (!e.target.files) return alert('no file chosen');

        formData.append('avatar', e.target.files[0]);
        setLoadingAvatar(true);

        try {
            const { data } = await http.post('/users/avatar', formData);
            context.setUser({ ...context.user, avatar: data.avatar });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingAvatar(false);
        }
    };

    const handleDeleteAvatar = async () => {
        setDeleteAvatarLoading(true);
        try {
            const { data, status } = await http.delete('/users/avatar');
            console.log(data);
            if (status === 200) {
                context.setUser(data.user);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteAvatarLoading(false);
        }
    };

    return (
        <settingsContext.Provider
            value={{
                usernameEditMode,
                bioEditMode,
                setUsernameEditMode,
                setBioEditMode,
                usernameInputRef,
                bioInputRef,
                setUsernameInputToEditMode,
                setBioInputToEditMode,
                handleEditUsername,
                handleEditBio,
                handleEditAvatar,
                handleDeleteAvatar,
                loadingAvatar,
                setLoadingAvatar,
                deleteAvatarLoading
            }}
        >
            {children}
        </settingsContext.Provider>
    );
};

export const useSettingsContext = () => useContext(settingsContext);
