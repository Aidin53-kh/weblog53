import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import RegisterFrom from '../../components/auth/RegisterForm';

export default function Register() {
    return (
        <div className="flex items-center justify-center w-full p-3 pb-12 mt-12 md:mt-0">
            <div className="max-w-xl rounded-lg border px-4 pb-4 mx-auto">
                <div className="flex items-center py-3">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                    <h2 className="text-2xl ml-6 mb-1 font-extrabold">Register</h2>
                </div>
                <p className="text-sm text-gray-500 mt-2 mb-6">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.{' '}
                    <Link href="/auth/login">
                        <a className="text-blue-500">login</a>
                    </Link>{' '}
                    qui incidunt quibusdam laboriosam. Perferendis.
                </p>
                <RegisterFrom />
            </div>
        </div>
    );
}
