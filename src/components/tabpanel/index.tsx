import React from 'react';

interface TabPanelProps {
    value: number;
    index: number;
    children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ index, value, children }) => {
    return <div hidden={index !== value}>{children}</div>;
};

export default TabPanel;
