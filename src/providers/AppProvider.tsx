import { useContext, useEffect, useState, createContext } from 'react';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import LoginAndRegisterDialog from '../components/auth';
import { Pages } from '../components/auth/types';
import { http } from '../services';
import { AppContext, DEFAULT_APP_CONTEXT_VALUES } from './types';

export const appContext = createContext<AppContext>(DEFAULT_APP_CONTEXT_VALUES);

export const AppProvider: React.FC = ({ children }) => {
    const { data, error } = useSWR('/api/auth/test', (url: string) => http.get(url).then(res => res.data), {
        revalidateOnFocus: true,
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
            const { data } = await http.post('/api/auth/register', values);
            setUser(data.user);
        } catch (error: any) {
            console.log(error.response);
        }
    };

    const handleLogin = async (values: any) => {
        try {
            const { data } = await http.post('/api/auth/login', values);
            setUser(data.user);
        } catch (error: any) {
            console.log(error.response);
        }
    };

    const handleLogout = async () => {
        try {
            await http.get('/api/auth/logout');
            setUser({});
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (data) {
            setUser(data.user);
            setIsAuthenticate(true);
        }
    }, [data]);

    useEffect(() => {
        if (error || data) setAuthLoading(false);
    }, [error, data]);

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
