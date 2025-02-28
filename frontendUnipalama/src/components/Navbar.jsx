import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom"; // Agrega useNavigate

const Navbar = () => {
    const { auth, cerrarSesion } = useAuth(); // Extrae el estado de autenticación y la función de cerrarSesion
    console.log("Estado de autenticación:", auth); // Depuración
    const navigate = useNavigate(); // Obtén la función navigate
    

    const nombreUsuario = auth.usuario?.nombre || "Usuario"; // Obtén el nombre del usuario o usa "Usuario" como valor predeterminado
    console.log(auth); // Verifica qué hay en el estado de autenticación

    const [mostrarMenu, setMostrarMenu] = useState(false); // Estado para controlar la visibilidad del menú

    const toggleMenu = () => {
        setMostrarMenu(!mostrarMenu); // Alternar la visibilidad del menú
    };

    const handleCerrarSesion = () => {
      cerrarSesion(); // Cierra la sesión
      navigate("/"); // Redirige al login
  };

    return (
        <nav className="shadow bg-slate-100 mb-5 flex fixed z-10 w-full top-0 justify-between items-center p-4">
            {/* Logo o título */}
            <Link to="/homeHs" className="home-nabvar">
            <h1 className="title-navbar">
                UNI<span className="color-title-navbar">PALMA</span>
            </h1>
            </Link>

            {/* Menú de usuario */}
            <div className="relative">
                <button
                    onClick={toggleMenu}
                    className="flex items-center gap-2 hover:bg-slate-200 p-2 rounded-lg transition-all"
                >
                    <span>Hola, {nombreUsuario}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </button>

                {/* Menú desplegable */}
                {mostrarMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                        {/* <Link
                            to="/perfil"
                            className="block px-4 py-2 text-gray-700 hover:bg-slate-100"
                        >
                            Perfil
                        </Link> */}
                        <button
                            onClick={handleCerrarSesion} // Usa handleCerrarSesion
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-slate-100"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;