import { useContext } from 'react';
import {AuthContext} from '../context/AuthProvider';

const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    
    // Destructuración con valores por defecto para evitar errores
    const {
        auth = {
            token: null,
            usuario: null,
            rol: null,
            auth: false
        },
        setAuth = () => {},
        cargando = true,
        login = async () => ({ ok: false, msg: 'Función no disponible' }),
        cerrarSesion = () => {},
        actualizarPerfil = async () => ({ msg: 'Función no disponible', error: true }),
        guardarPassword = async () => ({ msg: 'Función no disponible', error: true })
    } = context;
    
    // Funciones adicionales derivadas del estado
    const esAdmin = () => auth.rol === 'admin';
    const esHS = () => auth.rol === 'hs';
    const estaAutenticado = () => auth.auth === true;
    
    return {
        auth,
        setAuth,
        cargando,
        login,
        cerrarSesion,
        actualizarPerfil,
        guardarPassword,
        esAdmin,
        esHS,
        estaAutenticado
    };
};

export default useAuth;