import React from 'react';
// import './diseño.css'; // Importamos los estilos CSS
import { Link, NavLink } from 'react-router-dom';

const PanelAdministracion = () => {
  return (
    <>
      {/* Navbar */}
        <nav className="nav-unipalma">
            <div className="hamburger-unipalma" id="hamburger-unipalma">
                <div className="line-unipalma"></div>
            </div>
            <ul id="menu-unipalma" className="menu-unipalma">
                <li>
                    <NavLink to="/" className="nav-link-unipalma">
                        Cerrar Sesión
                    </NavLink>
                </li>
            </ul>
        </nav>

      {/* Contenedor principal */}
      <div className="admin-container">
        <h1 className="admin-title">Panel de Administración de Usuarios</h1>
        
        {/* Formulario para agregar/editar usuarios */}
        <form id="user-form" className="admin-form">
          <input 
            type="text" 
            id="username" 
            className="admin-input" 
            placeholder="Nombre de usuario" 
            required 
          />
          <input 
            type="password" 
            id="password" 
            className="admin-input" 
            placeholder="Contraseña" 
            required 
          />
          <button type="submit" className="admin-button">
            Agregar Usuario
          </button>
        </form>

        {/* Lista de usuarios (se poblará dinámicamente) */}
        <div id="user-list" className="admin-list"></div>
      </div>
    </>
  );
};

export default PanelAdministracion;