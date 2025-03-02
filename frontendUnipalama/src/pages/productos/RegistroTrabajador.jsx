import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import useProductos from "../../hooks/useProductos";
import Navbar from "../../components/Navbar";

import Alerta from "../../components/Alerta";
import React, { useState } from 'react';

import { Link } from 'react-router-dom'; // Para manejar la navegación


const RegistroTrabajador = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [cargo, setCargo] = useState('');
    const [centro_de_operacion, setcentro_de_operacion] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [contacto, setContacto] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para manejar el envío del formulario
        const trabajador = {
            nombre,
            apellido,
            cedula,
            cargo,
            centro_de_operacion,
            empresa,
            contacto,
        };

        console.log('Datos enviados:', trabajador);

        try {
            const response = await fetch('http://localhost:4000/api/epp/registrar-trabajador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trabajador),
            });

            console.log('Respuesta del servidor:', response);

            const data = await response.json();
            if (data.success) {
                Swal.fire('Éxito', 'Trabajador registrado correctamente', 'success');
            } else {
                Swal.fire('Error', 'No se pudo registrar el trabajador', 'error');
            }
        } catch (error) {
            console.error('Error al registrar el trabajador:', error);
            Swal.fire('Error', 'Hubo un problema al registrar el trabajador', 'error');
        }
    };

    return (
        <div className="body-registro">
            {/* Menú de navegación */}
            <nav className="nav-registro">
                <div className="hamburger-registro" id="hamburger-registro">
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                </div>
                <ul id="menu" className="menu">
                    <li>
                        <Link to="/home" className="nav-link-registro">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/" className="nav-link-registro">Cerrar Sesión</Link>
                    </li>
                </ul>
            </nav>

            {/* Contenedor del formulario */}
            <div className="registro-container">
                <h2>Registro de Trabajador</h2>
                <form id="registroForm" className="registro-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre" className="registro-label">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            className="registro-input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido" className="registro-label">
                            Apellido:
                        </label>
                        <input
                            type="text"
                            id="apellido"
                            className="registro-input"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cedula" className="registro-label">
                            Cédula:
                        </label>
                        <input
                            type="text"
                            id="cedula"
                            className="registro-input"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cargo" className="registro-label">
                            Cargo:
                        </label>
                        <input
                            id="cargo"
                            className="registro-input"
                            type="text"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="centro_de_operacion" className="registro-label">
                            Centro de operacion:
                        </label>
                        <input
                            type="text"
                            id="centro_de_operacion"
                            value={centro_de_operacion}
                            onChange={(e) => setcentro_de_operacion(e.target.value)}
                            className="registro-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="empresa" className="registro-label">
                            Empresa:
                        </label>
                        <input
                            type="text"
                            id="empresa"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            name="empresa"
                            className="registro-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contacto" className="registro-label">
                            Número de Contacto:
                        </label>
                        <input
                            type="text"
                            id="contacto"
                            value={contacto}
                            onChange={(e) => setContacto(e.target.value) }
                            name="contacto"
                            className="registro-input"
                            required
                        />
                    </div>
                    <button type="submit" className="registro-button">
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistroTrabajador;
//export default FormularioProductos;
