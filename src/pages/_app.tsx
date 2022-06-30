import React from 'react';
import AppLayout from '../layouts/AppLayout';
import { AppProvider } from '../providers/AppProvider';

import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import '../../styles/global.css';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function app({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <AppProvider>
            <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>
        </AppProvider>
    );
}
