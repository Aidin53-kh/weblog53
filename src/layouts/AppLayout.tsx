import React from 'react';
import Navbar from '../components/navbar';

const AppLayout: React.FC = ({ children }) => {
    return (
        <div className="flex">
            <Navbar />
            {children}
        </div>
    );
};

export default AppLayout;
