import Error from "next/error";
import { useAppContext } from '../../providers/AppProvider';

const Protected: React.FC = ({ children }) => {
    const context = useAppContext();
    
    if (!context.isAuthenticate) {
        return <Error statusCode={404} />
    }
    
    return <>{children}</>;
};

export default Protected;
