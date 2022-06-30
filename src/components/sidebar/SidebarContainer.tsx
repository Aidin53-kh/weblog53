interface SidebarProps {
    className?: string;
}

const SidebarContainer: React.FC<SidebarProps> = ({ children, className }) => {
    return (
        <aside
            className={`w-[480px] xl:w-[680px] hidden lg:block border-l max-h-screen sticky top-0 overflow-hidden  ${
                className || ''
            }`}
        >
            <div className="px-8 sticky top-0">{children}</div>
        </aside>
    );
};

export default SidebarContainer;
