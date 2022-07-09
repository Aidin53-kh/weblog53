import Error from "next/error";
import { useAppContext } from '../../providers/AppProvider';

const Protected: React.FC = ({ children }) => {
    const context = useAppContext();
    
    if (context.isAuthenticate) {
        return <>{children}</>;
    }
    
    return <Error statusCode={404} />
};

export default Protected;
