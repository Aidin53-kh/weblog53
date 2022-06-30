import { Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useAppContext } from "../../providers/AppProvider";
import { http } from "../../services";
import { loginSchema } from "./schema";

const LoginForm = () => {
    const router = useRouter();
    const { login } = useAppContext();

    return (
        <Formik initialValues={{ username: '', password: '' }} onSubmit={login} validationSchema={loginSchema}>
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
                    <Button type="submit">login</Button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
