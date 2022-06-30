import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppContext } from '../../providers/AppProvider';

interface TabsProps {
    active?: number;
}

export enum UserTab {
    HOME,
    SAVED,
    ABOUT,
}

export const UserPageTabs: React.FC<TabsProps> = ({ active = UserTab.HOME }) => {
    const router = useRouter();
    const context = useAppContext();
    const { username } = router.query;

    return (
        <div className="border-b flex">
            <Link href={`/${username}`}>
                <a className={`py-1 px-4 border-blue-400 text-[15px] ${active === UserTab.HOME && 'border-b-2'}`}>Home</a>
            </Link>
            {context.user.username === username && (
                <Link href={`/${username}/saved`}>
                    <a className={`py-1 px-4 border-blue-400 text-[15px] ${active === UserTab.SAVED && 'border-b-2'}`}>Saved</a>
                </Link>
            )}
            <Link href={`/${username}/about`}>
                <a className={`py-1 px-4 border-blue-400 text-[15px] ${active === UserTab.ABOUT && 'border-b-2'}`}>About</a>
            </Link>
        </div>
    );
};
