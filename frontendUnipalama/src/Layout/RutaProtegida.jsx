import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader'; // Componente de carga personalizado

const RutaProtegida = ({ rolRequerido, rolesPermitidos }) => {
    const { auth, cargando } = useAuth();
    const location = useLocation();

    // Mostrar un loader personalizado mientras se verifica la autenticación
    if (cargando) return <Loader mensaje="Verificando autenticación..." />;

    // Si no está autenticado, redirige al login guardando la ubicación previa
    if (!auth.auth) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Verificación de roles si se especificaron
    if (rolRequerido && auth.rol !== rolRequerido) {
        // Redirige a la ruta por defecto según el rol del usuario
        const rutaPorRol = auth.rol === 'admin' ? '/admin' : '/homeHs';
        return <Navigate to={rutaPorRol} replace />;
    }

    // Verificación para múltiples roles permitidos (opcional)
    if (rolesPermitidos && !rolesPermitidos.includes(auth.rol)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow p-4 md:p-6 bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
};

// Valores por defecto para las props
RutaProtegida.defaultProps = {
    rolRequerido: null,
    rolesPermitidos: null
};

export default RutaProtegida;