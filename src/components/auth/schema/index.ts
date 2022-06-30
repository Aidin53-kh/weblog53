import * as Yup from 'yup';

export const loginSchema = Yup.object({
    username: Yup.string().min(3).max(30).required(),
    password: Yup.string().min(6).required(),
});

export const registerSchema = Yup.object({
    username: Yup.string().min(3).max(30).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')])
        .required(),
});
