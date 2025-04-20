import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './PanelAdministracion.css';

const PanelAdministracion = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const { data } = await axios.get('http://localhost:4000/api/usuarios', config);
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBloquearUsuario = async (id, confirmadoActual) => {
    if (window.confirm(`¿Estás seguro que deseas ${confirmadoActual ? 'bloquear' : 'desbloquear'} este usuario?`)) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        await axios.put(`http://localhost:4000/api/usuarios/${id}`, {
          confirmado: !confirmadoActual
        }, config);
        
        obtenerUsuarios();
      } catch (error) {
        console.error('Error al bloquear/desbloquear usuario:', error);
      }
    }
  };

  const cambiarPassword = async (id, email) => {
    try {
      // Validación en dos pasos
      const nuevaPassword = prompt(`Nueva contraseña para ${email}:`);
      if (!nuevaPassword) return;
      
      if (nuevaPassword.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
      }
  
      const confirmacion = prompt('Confirme la nueva contraseña:');
      if (nuevaPassword !== confirmacion) {
        alert('Las contraseñas no coinciden');
        return;
      }
  
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado');
        navigate('/'); // Redirige a la página principal en lugar de /login
        return;
      }
  
      // URL fija (o configurada en vite.config.js)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      const response = await axios.put(
        `${API_URL}/api/usuarios/${id}/password`,
        { nuevaPassword },
        {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
        
      );
      
      if (response.data.success) {
        alert('Contraseña cambiada exitosamente');
        obtenerUsuarios();
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.response?.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Navbar */}
      <div className="admin-header">
        <h1 className="admin-header-title">Panel de Administración</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="admin-logout-btn"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="admin-content">
        <div className="admin-toolbar">
          <h2 className="admin-title">Gestión de Usuarios</h2>
          <Link 
            to="/admin/nuevo-usuario"
            className="admin-create-btn"
          >
            <span className="admin-create-btn-icon">+</span>
            Crear Nueva Cuenta
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="admin-search-container">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            className="admin-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="admin-search-icon">🔍</span>
        </div>

        {/* Tabla de usuarios */}
        <div className="admin-table-container">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner"></div>
              <p className="admin-loading-text">Cargando usuarios...</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead className="admin-table-header">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="admin-table-body">
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map(usuario => (
                    <tr key={usuario._id} className="admin-table-row">
                      <td className="admin-user-cell">
                        <div className="admin-user-avatar">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-user-name">{usuario.nombre}</div>
                      </td>
                      <td className="admin-email-cell">{usuario.email}</td>
                      <td className="admin-role-cell">
                        <span className={`admin-role-badge ${usuario.rol === 'admin' ? 'admin-role-admin' : 'admin-role-hs'}`}>
                          {usuario.rol === 'admin' ? 'Administrador' : 'Usuario HS'}
                        </span>
                      </td>
                      <td className="admin-status-cell">
                        <span className={`admin-status-badge ${usuario.confirmado ? 'admin-status-active' : 'admin-status-inactive'}`}>
                          {usuario.confirmado ? 'Activo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="admin-actions-cell">
                        <div className="admin-actions-group">
                          <button
                            onClick={() => toggleBloquearUsuario(usuario._id, usuario.confirmado)}
                            className={`admin-action-btn ${usuario.confirmado ? 'admin-block-btn' : 'admin-unblock-btn'}`}
                          >
                            {usuario.confirmado ? 'Bloquear' : 'Desbloquear'}
                          </button>
                          <button
                            onClick={() => cambiarPassword(usuario._id)}
                            className="admin-action-btn admin-password-btn"
                          >
                            Cambiar Contraseña
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="admin-empty-row">
                    <td colSpan="5">No se encontraron usuarios</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelAdministracion;