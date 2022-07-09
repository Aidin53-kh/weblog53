import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
    return (
        <div className="flex items-center justify-center w-full p-3 pb-12 mt-12 md:mt-0">
            <div className="max-w-xl rounded-lg border px-4 pb-4 mx-auto">
                <div className="flex items-center py-3">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                    <h2 className="text-2xl ml-6 mb-1 font-extrabold">Login</h2>
                </div>
                <p className="text-sm text-gray-500 mt-2 mb-6">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.{' '}
                    <Link href="/auth/register">
                        <a className="text-blue-500">register</a>
                    </Link>{' '}
                    qui incidunt quibusdam laboriosam. Perferendis.
                </p>
                <LoginForm />
            </div>
        </div>
    );
}
