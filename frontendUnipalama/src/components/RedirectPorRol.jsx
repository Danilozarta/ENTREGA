import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RedirectPorRol = () => {
    const { auth } = useAuth();
    
    if (!auth.auth) return <Navigate to="/" />;
    
    return auth.rol === 'admin' 
        ? <Navigate to="/admin" replace /> 
        : <Navigate to="/homeHs" replace />;
};

export default RedirectPorRol;