import { useEffect, useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Search } from '@mui/icons-material';
import { useRouter } from 'next/router';

interface SidebarSearchProps {
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
}

const SidebarSearch: FC<SidebarSearchProps> = ({ onChange, onSearch }) => {
    const { query } = useRouter();
    const [search, setSearch] = useState(query.search as string || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        onSearch?.(search);
    }

    useEffect(() => {
        if (query.search) setSearch(query.search as string);
    }, []);

    return (
        <form onSubmit={handleSearch} className="my-8 px-4 py-2 border rounded-full flex gap-3 items-center overflow-hidden">
            <span onClick={(e) => onSearch?.(search)}>
                <Search className="text-gray-600" />
            </span>
            <input
                onChange={(e) => {
                    onChange?.(e.target.value);
                    setSearch(e.target.value);
                }}
                type="text"
                className="w-full outline-none text-sm"
                placeholder="Search"
                value={search}
            />
        </form>
    );
};

export default SidebarSearch;
