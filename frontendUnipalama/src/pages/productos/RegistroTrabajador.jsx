import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import useProductos from "../../hooks/useProductos";
import Navbar from "../../components/Navbar";

import Alerta from "../../components/Alerta";
import React, { useState } from 'react';



const RegistroTrabajador = () => {
    const navigate = useNavigate(); 

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [cargo, setCargo] = useState('');
    const [centro_de_operacion, setcentro_de_operacion] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [contacto, setContacto] = useState('');

    // Genera un prefijo único para todos los campos en esta instancia
    const [formId] = useState(() => `form_${Math.random().toString(36).substr(2, 5)}`);
   

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
                    // Limpiar los campos antes de que el usuario haga clic en  las opciones de alerta "Aceptar"
                    setNombre('');
                    setApellido('');
                    setCedula('');
                    setCargo('');
                    setcentro_de_operacion('');
                    setEmpresa('');
                    setContacto('');

                    // Alerta con botones
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Trabajador registrado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Nuevo registro',
                        cancelButtonText: 'Ir al inicio',
                        showCancelButton: true,
                        confirmButtonColor: '#1abc9c',
                        cancelButtonColor: '#bdc3c7',
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isDismissed ) {
                            navigate("/homeHs"); // Redirige a /homeHs
                        }
                        // Si hace clic en "Nuevo registro", no se hace nada (el formulario ya está limpio)
                    });
        
            } else {
                Swal.fire('Error', 'No se pudo registrar el trabajador', 'error');
            }
        } catch (error) {
            console.error('Error al registrar el trabajador:', error);
            Swal.fire('Error', 'Hubo un problema al registrar el trabajador', 'error');
        }
    };

    return (
        <div className="registro-container">
            <h2>Registro de Trabajador</h2>
            <form 
                onSubmit={handleSubmit} 
                autoComplete="off"  // Desactiva autocompletado en el formulario
                className="registro-form"        // ID único para el formulario
            >
                {/* Campo Nombre */}
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        className="registro-input"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        name={`${formId}_nombre`}  // Nombre único
                        autoComplete="new-password" // Truco infalible
                        required
                    />
                </div>

                {/* Campo Apellido */}
                <div className="form-group">
                    <label htmlFor="apellido">Apellido:</label>
                    <input
                        type="text"
                        id="apellido"
                        className="registro-input"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        name={`${formId}_apellido`}
                        autoComplete="new-password"
                        required
                    />
                </div>

                {/* Campo Cédula */}
                <div className="form-group">
                    <label htmlFor="cedula">Cédula:</label>
                    <input
                        type="number"
                        id="cedula"
                        className="registro-input"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
                        name={`${formId}_cedula`}
                        autoComplete="new-password"
                        required
                        style={{ 
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield',
                        }}
                    />
                </div>

                {/* Campo Cargo */}
                <div className="form-group">
                    <label htmlFor="cargo">Cargo:</label>
                    <input
                        type="text"
                        id="cargo"
                        className="registro-input"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        name={`${formId}_cargo`}
                        autoComplete="new-password"
                        required
                    />
                </div>

                {/* Campo Centro de Operación */}
                <div className="form-group">
                    <label htmlFor="centro_de_operacion">Centro de Operación:</label>
                    <input
                        type="text"
                        id="centro_de_operacion"
                        className="registro-input"
                        value={centro_de_operacion}
                        onChange={(e) => setcentro_de_operacion(e.target.value)}
                        name={`${formId}_centro_operacion`}
                        autoComplete="new-password"
                        required
                    />
                </div>

                {/* Campo Empresa */}
                <div className="form-group">
                    <label htmlFor="empresa">Empresa:</label>
                    <input
                        type="text"
                        id="empresa"
                        className="registro-input"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        name={`${formId}_empresa`}
                        autoComplete="new-password"
                        required
                    />
                </div>

                {/* Campo Contacto */}
                <div className="form-group">
                    <label htmlFor="contacto">Teléfono:</label>
                    <input
                        type="number"
                        id="contacto"
                        className="registro-input"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value.replace(/\D/g, ''))}
                        name={`${formId}_contacto`}
                        autoComplete="new-password"
                        required
                        style={{ 
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield',
                        }}
                    />
                </div>

                <button type="submit" className="registro-button">
                    Registrar
                </button>
            </form>
        </div>
    );
};

export default RegistroTrabajador;
//export default FormularioProductos;
