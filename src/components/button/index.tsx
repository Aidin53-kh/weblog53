import { Button as MuiButton, ButtonProps } from '@mui/material';

interface IButtonProps extends ButtonProps {}

const Button: React.FC<IButtonProps> = ({ className, children, ...props }) => {
    return (
        <MuiButton variant="outlined" className={`px-7 py-1 rounded-full ${className || ''}`} {...props}>
            {children}
        </MuiButton>
    );
};

export default Button;
