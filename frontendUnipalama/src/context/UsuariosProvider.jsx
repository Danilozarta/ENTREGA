import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth';

const UsuariosContext = createContext();

const UsuariosProvider = ({ children }) => {

    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({});
    const { auth } = useAuth();

    // Configuración común de headers
    const getConfig = () => {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        };
    };

     // Obtener lista de usuarios (solo para admin)
     useEffect(() => {
        const obtenerUsuarios = async () => {
            if (auth?.rol !== 'admin') return;
            
            try {
                const { data } = await clienteAxios.get('/admin/usuarios', getConfig());
                setUsuarios(data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                if (error.response?.status === 403) {
                    console.log('No tienes permisos para ver esta lista');
                }
            }
        };

        obtenerUsuarios();
    }, [auth]); // Dependencia de auth para reaccionar a cambios


     // Guardar o actualizar usuario
     const guardarUsuario = async (usuario) => {
        try {
            let data;
            if (usuario.id) {
                // Actualizar usuario existente
                const response = await clienteAxios.put(`/admin/usuarios/${usuario.id}`, usuario, getConfig());
                data = response.data;
                const usuariosActualizados = usuarios.map(u => u._id === data._id ? data : u);
                setUsuarios(usuariosActualizados);
            } else {
                // Crear nuevo usuario
                const response = await clienteAxios.post('/admin/usuarios', usuario, getConfig());
                data = response.data;
                const { createdAt, updatedAt, __v, ...usuarioAlmacenado } = data;
                setUsuarios([usuarioAlmacenado, ...usuarios]);
            }
            return { success: true, data };
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            return { 
                success: false, 
                msg: error.response?.data?.msg || 'Error al procesar la solicitud' 
            };
        }
    };

    const setEdicion = (usuario) => {
        setUsuario(usuario);
    };

    const eliminarUsuario = async (id) => {
        const confirmar = confirm('¿Confirmas que deseas eliminar?');
        if (confirmar) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios.delete(`/usuarios/${id}`, config);
                const usuariosActualizados = usuarios.filter(usuarioState => usuarioState._id !== id);
                setUsuarios(usuariosActualizados);
            } catch (error) {
                console.log(error);
            }
        };
    };
    
    return (
        <UsuariosContext.Provider
            value={{
                usuarios,
                guardarUsuario,
                setEdicion,
                usuario,
                eliminarUsuario
            }}
        >
            {children}
        </UsuariosContext.Provider>
    );
}
export {
    UsuariosProvider
}
export default UsuariosContext;