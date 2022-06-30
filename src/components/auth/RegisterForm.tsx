import { Button, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useAppContext } from '../../providers/AppProvider';
import { http } from '../../services';
import { registerSchema } from './schema';

const RegisterFrom = () => {
    const router = useRouter();
    const { register } = useAppContext();

    return (
        <Formik
            initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
            onSubmit={register}
            validationSchema={registerSchema}
        >
            {({ errors, touched, handleChange }) => (
                <Form>
                    <TextField
                        fullWidth
                        label="username"
                        name="username"
                        className="mb-5"
                        onChange={handleChange}
                        error={!!(errors.username && touched.username)}
                        helperText={errors.username && touched.username && errors.username}
                        FormHelperTextProps={{
                            className: 'text-red-400',
                        }}
                    />
                    <TextField
                        fullWidth
                        label="email"
                        name="email"
                        className="mb-5"
                        onChange={handleChange}
                        error={!!(errors.email && touched.email)}
                        helperText={errors.email && touched.email && errors.email}
                        FormHelperTextProps={{
                            className: 'text-red-400',
                        }}
                    />
                    <TextField
                        fullWidth
                        label="password"
                        name="password"
                        className="mb-5"
                        onChange={handleChange}
                        error={!!(errors.password && touched.password)}
                        helperText={errors.password && touched.password && errors.password}
                        FormHelperTextProps={{
                            className: 'text-red-400',
                        }}
                    />
                    <TextField
                        fullWidth
                        label="confirmPassword"
                        name="confirmPassword"
                        className="mb-5"
                        onChange={handleChange}
                        error={!!(errors.confirmPassword && touched.confirmPassword)}
                        helperText={errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                        FormHelperTextProps={{
                            className: 'text-red-400',
                        }}
                    />
                    <Button type="submit">register</Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterFrom;
