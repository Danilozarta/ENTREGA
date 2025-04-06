import { useState, useEffect, createContext, useContext } from 'react';
import clienteAxios from '../config/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cargando, setCargando] = useState(true);
    const [auth, setAuth] = useState({
        token: null,
        usuario: null,
        rol: null,
        auth: false
    });

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setCargando(false);
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            
            try {
                const { data } = await clienteAxios('/usuarios/perfil', config);
                
                setAuth({
                    token,
                    usuario: data.usuario, // Asegúrate que tu backend devuelve el objeto usuario
                    rol: data.usuario.rol, // Asume que el rol viene en data.usuario.rol
                    auth: true
                });
                
            } catch (error) {
                console.log(error.response?.data?.msg || 'Error de autenticación');
                setAuth({
                    token: null,
                    usuario: null,
                    rol: null,
                    auth: false
                });
                localStorage.removeItem('token');
            }
            setCargando(false);
        };
        autenticarUsuario();
    }, []);

    // Función para login que ahora maneja el rol
    const login = async (email, password) => {
        try {
            const { data } = await clienteAxios.post('/usuarios/login', { email, password });
            
             // Establece el token en localStorage y en axios
            localStorage.setItem('token', data.token);
            clienteAxios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            // Actualiza el estado auth
            setAuth({
                token: data.token,
                usuario: data.usuario,
                rol: data.usuario.rol, // Asegúrate que el backend devuelve el rol
                auth: true
            });
            
            return {
                    ok: true,
                    rol:data.usuario.rol};
        } catch (error) {
            return {
                ok: false,
                msg: error.response?.data?.msg || 'Error al iniciar sesión'
            };
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({
            token: null,
            usuario: null,
            rol: null,
            auth: false
        });
    };

    const actualizarPerfil = async datos => {
        const token = localStorage.getItem('token');
        if (!token) {
            return { msg: 'No hay token', error: true };
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const url = `/usuarios/perfil/${datos._id}`;
            const { data } = await clienteAxios.put(url, datos, config);
            
            // Actualiza los datos del usuario en el estado
            setAuth(prev => ({
                ...prev,
                usuario: data.usuario,
                rol: data.usuario.rol // Actualiza el rol si cambió
            }));
            
            return { msg: 'Perfil actualizado correctamente' };
        } catch (error) {
            return {
                msg: error.response?.data?.msg || 'Error al actualizar perfil',
                error: true
            };
        }
    };

    const guardarPassword = async (datos) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return { msg: 'No hay token', error: true };
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const url = '/usuarios/actualizar-password';
            const { data } = await clienteAxios.put(url, datos, config);
            return { msg: data.msg };
        } catch (error) {
            return {
                msg: error.response?.data?.msg || 'Error al cambiar contraseña',
                error: true
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                login, // Añadida la función de login
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider ;
// export default AuthContext;