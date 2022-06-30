import { Pages } from '../../components/auth/types';
import type { Dispatch, SetStateAction, Ref, ChangeEvent } from 'react';

export interface AppContext {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    isAuthenticate: boolean;
    authLoading: boolean;
    closeLoginAndRegisterDialog: () => void;
    openLoginAndRegisterDialog: (page: Pages) => void;
    register: (values: any) => void;
    login: (values: any) => void;
    logout: () => void;
}

export const DEFAULT_APP_CONTEXT_VALUES = {
    user: {},
    setUser: () => {},
    isAuthenticate: false,
    authLoading: true,
    closeLoginAndRegisterDialog: () => {},
    openLoginAndRegisterDialog: () => {},
    register: () => {},
    login: () => {},
    logout: () => {},
};

export interface SettingsContext {
    usernameEditMode: boolean;
    setUsernameEditMode: Dispatch<SetStateAction<boolean>>;
    bioEditMode: boolean;
    setBioEditMode: Dispatch<SetStateAction<boolean>>;
    usernameInputRef: Ref<HTMLInputElement>;
    bioInputRef: Ref<HTMLInputElement>;
    setUsernameInputToEditMode: () => void;
    setBioInputToEditMode: () => void;
    handleEditUsername: (values: any) => void;
    handleEditBio: (values: any) => void;
    handleEditAvatar: (e: ChangeEvent<HTMLInputElement>) => void;
    handleDeleteAvatar: () => void;
    loadingAvatar: boolean;
    setLoadingAvatar: Dispatch<SetStateAction<boolean>>;
    deleteAvatarLoading: boolean;
}

export const DEFAULT_SETTINGS_CONTEXT_VALUES = {
    usernameEditMode: false,
    setUsernameEditMode: () => {},
    bioEditMode: false,
    setBioEditMode: () => {},
    usernameInputRef: null,
    bioInputRef: null,
    setUsernameInputToEditMode: () => {},
    setBioInputToEditMode: () => {},
    handleEditUsername: () => {},
    handleEditBio: () => {},
    handleEditAvatar: () => {},
    handleDeleteAvatar: () => {},
    loadingAvatar: false,
    setLoadingAvatar: () => {},
    deleteAvatarLoading: false
};

export interface PostDetailsContext {
    savePost: (postId: string) => void;
    likePost: (postId: string) => void;
    likesCount: number;
    setLikesCount: Dispatch<SetStateAction<number>>;
    isPostLiked: boolean;
    setIsPostLiked: Dispatch<SetStateAction<boolean>>;
    likeLoading: boolean;
    bookmarkLoading: boolean;
    isSaved: boolean;
    setIsSaved: Dispatch<SetStateAction<boolean>>;
    openCommentSidebar: boolean;
    setOpenCommentSidebar: Dispatch<SetStateAction<boolean>>;
}

export const DEFAULT_POST_DETAILS_CONTEXT_VALUES = {
    savePost: () => {},
    likePost: () => {},
    likesCount: 0,
    setLikesCount: () => {},
    isPostLiked: false,
    setIsPostLiked: () => {},
    likeLoading: false,
    bookmarkLoading: false,
    isSaved: false,
    setIsSaved: () => {},
    openCommentSidebar: false,
    setOpenCommentSidebar: () => {},
};
