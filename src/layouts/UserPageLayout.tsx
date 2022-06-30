import { Fragment } from 'react';
import { MoreHoriz } from '@mui/icons-material';
import Container from '../components/container';
import PageSidebar from '../components/sidebar/PageSidebar';
import { UserPageTabs, UserTab } from '../components/user/Tabs';

interface UserPageLayoutProps {
    user: any;
    activeTab?: UserTab;
    showTabs?: boolean;
    showHeader?: boolean;
}

const UserPageLayout: React.FC<UserPageLayoutProps> = ({ children, user, activeTab, showHeader = true, showTabs = true }) => {
    return (
        <Fragment>
            <div className="border-x w-full">
                <Container>
                    {showHeader && (
                        <div className="flex items-center justify-between my-8">
                            <h1 className="text-4xl text-neutral-900 font-bold">{user.username}</h1>
                            <MoreHoriz className="text-gray-500" />
                        </div>
                    )}

                    {showTabs && <UserPageTabs active={activeTab || UserTab.HOME} />}

                    {children}
                </Container>
            </div>

            <PageSidebar user={user} />
        </Fragment>
    );
};

export default UserPageLayout;
