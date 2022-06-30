import React, { useContext } from 'react';

interface PageContext {}

const pageContext = React.createContext<PageContext>({});

export const PageProvider: React.FC = ({ children }) => {
    return <pageContext.Provider value={{}}>{children}</pageContext.Provider>;
};

export const usePageContext = () => useContext(pageContext);
