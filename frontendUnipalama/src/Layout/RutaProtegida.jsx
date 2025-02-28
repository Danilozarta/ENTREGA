import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar'

const RutaProtegida = () => {
    const { cargando } = useAuth();
    
    if (cargando) return 'cargando...'
    return (
        <div className="h-full">
            <Navbar />
            <Outlet />
        </div>
    )
}
export default RutaProtegida