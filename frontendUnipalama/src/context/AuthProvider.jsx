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
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const [inactivityTimer, setInactivityTimer] = useState(null);
    const [warningTimer, setWarningTimer] = useState(null);

    // Tiempos en milisegundos (ajusta según necesites)
    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // minutos
    // const WARNING_TIMEOUT =  2 * 1000; // minutos antes

    // Reiniciar el temporizador de inactividad
    const resetInactivityTimer = () => {
        setShowTimeoutWarning(false);
        
        // Limpiar temporizador existente
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }

        // Mostrar advertencia 5 minutos antes
        // const warningTimer = setTimeout(() => {
        //     setShowTimeoutWarning(true);
        // }, WARNING_TIMEOUT);

        // Cerrar sesión después del tiempo completo
        const timer = setTimeout(() => {
            cerrarSesion();
        }, INACTIVITY_TIMEOUT);

        setInactivityTimer(timer);
    };

    // Detectar actividad del usuario
    useEffect(() => {
        const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
        
        const handleActivity = () => {
            if (auth.auth) { // Solo si está autenticado
                resetInactivityTimer();
            }
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [auth.auth]);

    // Iniciar temporizador cuando el usuario se autentica
    useEffect(() => {
        if (auth.auth) {
            resetInactivityTimer();
        }
    }, [auth.auth]);

    // Autenticar usuario al cargar
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
                    usuario: data.usuario,
                    rol: data.usuario.rol,
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

    const login = async (email, password) => {
        try {
            // Validación básica en frontend
            if (!email || !password) {
                return {
                    ok: false,
                    msg: 'Email y contraseña son requeridos'
                };
            }

            const { data } = await clienteAxios.post('/usuarios/login', { email, password });

            // Validación exhaustiva de la respuesta
            if (!data.token || !data.usuario || !data.usuario._id) {
                throw new Error('Respuesta de autenticación inválida');
            }
            
            localStorage.setItem('token', data.token);
            clienteAxios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            setAuth({
                token: data.token,
                usuario: data.usuario,
                rol: data.usuario.rol,
                auth: true
            });
            
            resetInactivityTimer(); // Reiniciar temporizador al iniciar sesión
            
            return {
                ok: true,
                rol: data.usuario.rol,
                usuario: data.usuario // Devuelve el usuario completo para validación
            };
        } catch (error) {
            console.error('Error en login:', error);
            return {
                ok: false,
                msg: error.response?.data?.msg || 'Credenciales incorrectas',
                error: error
            };
        }
    };

    const cerrarSesion = () => {
        // Limpiar temporizadores
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        setShowTimeoutWarning(false);
        
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
                guardarPassword,
                showTimeoutWarning,
                setShowTimeoutWarning,
              
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider ;
// export default AuthContext;