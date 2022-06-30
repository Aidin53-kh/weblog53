import { useContext, useEffect, useState, createContext } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import LoginAndRegisterDialog from '../components/auth';
import { Pages } from '../components/auth/types';
import { http } from '../services';
import { AppContext, DEFAULT_APP_CONTEXT_VALUES } from './types';

export const appContext = createContext<AppContext>(DEFAULT_APP_CONTEXT_VALUES);

export const AppProvider: React.FC = ({ children }) => {
    const router = useRouter();

    const { data: response, error } = useSWR('/auth/isLogin', (url: string) => http.get(url), {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });

    const [openLoginAndRegister, setOpenLoginAndRegister] = useState(false);
    const [loginAndRegisterTab, setLoginAndRegisterTab] = useState(Pages.LOGIN);
    const [user, setUser] = useState({});
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const closeLoginAndRegisterDialog = () => setOpenLoginAndRegister(false);

    const openLoginAndRegisterDialog = (page: Pages) => {
        setLoginAndRegisterTab(page);
        setOpenLoginAndRegister(true);
    };

    const handleRegister = async (values: any) => {
        try {
            const { data } = await http.post('/auth/register', values);
            closeLoginAndRegisterDialog();
            setUser(data.user);
            router.push(`/${data.user.username}`);
        } catch (error: any) {
            console.log(error.response);
        }
    };

    const handleLogin = async (values: any) => {
        try {
            const { data } = await http.post('/auth/login', values);
            closeLoginAndRegisterDialog();
            setUser(data.user);
            router.push(`/${data.user.username}`);
        } catch (error: any) {
            console.log(error.response);
        }
    };

    const handleLogout = async () => {
        try {
            await http.get('/auth/logout');
            setUser({});
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (response?.status === 200) setUser(response.data.user);     
    }, [response]);

    useEffect(() => {
        if (error || response) setAuthLoading(false);
    }, [error, response]);

    useEffect(() => setIsAuthenticate(!isEmpty(user)), [user]);

    return (
        <appContext.Provider
            value={{
                user: user,
                isAuthenticate,
                setUser,
                authLoading,
                closeLoginAndRegisterDialog,
                openLoginAndRegisterDialog,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
            }}
        >
            {children}
            <LoginAndRegisterDialog
                open={openLoginAndRegister}
                setOpen={setOpenLoginAndRegister}
                page={loginAndRegisterTab}
                setPage={setLoginAndRegisterTab}
            />
        </appContext.Provider>
    );
};

export const useAppContext = () => useContext(appContext);
