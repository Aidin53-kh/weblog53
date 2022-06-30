import React from "react";

interface ContainerProps {
    className?: string;
}

const Container: React.FC<ContainerProps> = ({ className, children }) => {
    return <div className={`max-w-3xl lg:max-w-2xl w-full xl:max-w-3xl px-3 md:px-5 mx-auto ${className || ''}`}>{children}</div>;
};

export default Container;
