import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useProductos from '../../hooks/useProductos';
import Producto from './Producto';
import landingDesktop from '../../assets/landing_desktop.jpg';
import landingMobile from '../../assets/landing_mobile2.jpg';
import imgLogin from '../../assets/Unipalma-Vertical-Slogan-01.png';

const ListaProductos = () => {
    const { productos } = useProductos();

    return (
        <div>
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

            {/* Logo */}
            <div className="logo-container-unipalma">
                <img
                    src={imgLogin}
                    alt="Logo de Unipalma"
                    className="logo-unipalma"
                />
            </div>

            {/* Barra de búsqueda */}
            {/* <div className="search-container-unipalma">
                <input
                    type="number"
                    className="search-bar-unipalma"
                    placeholder="Ingrese la cédula..."
                />
                <button className="boton-buscar-unipalma">Buscar</button>
            </div> */}

            {/* Bloques de acciones */}
            <div className="actions-container-unipalma">
                <div className="action-box-unipalma">
                    <h2 className="action-title-unipalma">Registro de Trabajador</h2>
                    <Link to="/RegistroTrabajador" className="action-btn-unipalma">
                        Registrar
                    </Link>
                </div>
                <div className="action-box-unipalma">
                    <h2 className="action-title-unipalma">Entrega de Elementos</h2>
                    <Link to="/EntregaEPP" className="action-btn-unipalma">
                        Entregar
                    </Link>
                </div>
                <div className="action-box-unipalma">
                    <h2 className="action-title-unipalma">Registro de Entregas</h2>
                    <Link to="/buscar-trabajador-epp" className="action-btn-unipalma">
                        Buscar
                    </Link>
                </div>
            </div>

            {/* Imagen de landing */}
            {/* <div className="container-oferta">
                <img src={landingDesktop} alt="Landing Desktop" className="w-full" />
            </div> */}

            {/* Lista de productos */}
            {/* <div className="container-title">
                <p className="title-products">Nuevas Recomendaciones</p>
            </div> */}
            {/* <div className="container-products flex-wrap justify-center">
                {productos.length ? (
                    productos.map((producto) => (
                        <Producto key={producto.id} producto={producto} />
                    ))
                ) : (
                    <p className="mt-10 shadow-lg w-full text-center p-5 uppercase font-bold text-2xl">
                        No hay Productos
                    </p>
                )}
            </div> */}

            {/* Footer */}
            <footer className="footer-unipalma">
                <p>&copy; 2025 Unipalma. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default ListaProductos;