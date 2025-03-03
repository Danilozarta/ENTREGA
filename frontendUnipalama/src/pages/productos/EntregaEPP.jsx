import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para manejar la navegación
import Swal from 'sweetalert2';
import {format, parse} from "date-fns"

const EntregaEPP = () => {
    const [cedula, setCedula] = useState('');
    const [trabajador, setTrabajador] = useState(null);
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [eppEntregado, setEppEntregado] = useState('');
    const [referencia_tipo, setReferencia_tipo] = useState('');
    const [unidadesEntregadas, setUnidadesEntregadas] = useState('');
    const [nombreEntrega, setNombreEntrega] = useState('');
    const [tareaLabor, setTareaLabor] = useState('');

    // Recuperar el nombre del usuario al cargar el componente
    useEffect(() => {
        const nombreUsuario = localStorage.getItem('nombreUsuario'); // Recuperar nombre del usuario
        console.log('Nombre del usuario recuperado:', nombreUsuario); // Verificar en consola

        if (nombreUsuario) {
            setNombreEntrega(nombreUsuario); // Asignar el nombre al estado
        } else {
            console.error('No se encontró el nombre del usuario en la sesión.');
        }
    }, []);

    const handleBuscarTrabajador = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/epp/buscar-trabajador/${cedula}`);
            const data = await response.json();
            if (data.success) {
                setTrabajador(data.trabajador); // Asignar el trabajador al estado
            } else {
                Swal.fire('Error', 'Trabajador no encontrado', 'error');
            }
        } catch (error) {
            console.error('Error al buscar el trabajador:', error);
            Swal.fire('Error', 'Hubo un problema al buscar el trabajador', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que se haya buscado un trabajador
        if (!trabajador) {
            Swal.fire('Error', 'Debes buscar un trabajador primero', 'error');
            return;
        }
         // Obtener la fecha y hora actual en formato ISO
        const fechaHoraActual = new Date().toISOString(); // Formato: "2025-02-24T14:30:00.000Z"
         // Obtener la fecha y hora actual en formato personalizado
        //const fechaHoraActual = format(new Date(), 'dd/MM/yyyy HH:mm:ss'); // Formato: "24/02/2025 14:30:00"

        // Crear el objeto de entrega con datos válidos
        const entrega = {
            trabajador_id: trabajador._id,
            fecha_entrega: fechaHoraActual,  // Usar fecha y hora actual
            epp_entregado: eppEntregado,
            unidades_entregadas: Number(unidadesEntregadas), // Convertir a número
            referencia_tipo: referencia_tipo,
            nombre_hs_entrega: nombreEntrega,
            tarea_labor: tareaLabor,
        };

        console.log('Datos enviados:', JSON.stringify(entrega, null, 2)); // Verificar en consola

        try {
            const response = await fetch('http://localhost:4000/api/epp/registrar-entrega-epp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entrega),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar la entrega de EPP');
            }

            Swal.fire('Éxito', 'Entrega de EPP registrada correctamente', 'success');
        } catch (error) {
            console.error('Error al registrar la entrega de EPP:', error);
            Swal.fire('Error', error.message || 'Hubo un problema al registrar la entrega de EPP', 'error');
        }
    };

    const handleLimpiarFirma = () => {
        // Lógica para limpiar la firma
        console.log("Firma limpiada");
    };

    const handleCancelar = () => {
        // Lógica para cancelar
        console.log("Operación cancelada");
    };

    return (
        <div className="body-epp">
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

            {/* Contenedor principal */}
            <div className="epp-container">
                <h1 className="epp-title">Entrega de Elementos</h1>

                {/* Búsqueda por cédula */}
                <div className="epp-search">
                    <input
                        type="text"
                        id="epp-cedula"
                        className="epp-input"
                        placeholder="Ingrese la cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                    <button 
                        id="epp-buscar" 
                        className="epp-button"
                        onClick={handleBuscarTrabajador}
                    >
                        Buscar
                    </button>
                </div>

                {/* Datos del trabajador */}
                {trabajador && (
                    <div id="epp-datos-trabajador" className="epp-datos">
                        <div className="epp-dato">
                            <strong>Nombre:</strong> <span id="epp-nombre">{trabajador.nombre}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Apellido:</strong> <span id="epp-apellido">{trabajador.apellido}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Cédula:</strong> <span id="epp-cedula-trabajador">{trabajador.cedula}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Área:</strong> <span id="epp-area">{trabajador.area}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Labor:</strong> <span id="epp-labor-trabajador">{trabajador.labor}</span>
                        </div>
                    </div>
                )}

                {/* Formulario de entrega */}
                <form id="epp-formulario" className="epp-form" onSubmit={handleSubmit}>
                    <div className="epp-form-group">
                        <label htmlFor="epp-elemento">Elemento Entregado:</label>
                        <input
                            type="text"
                            id="epp-elemento"
                            className="epp-input"
                            value={eppEntregado}
                            onChange={(e) => setEppEntregado(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label htmlFor="epp-elemento">referencia_tipo:</label>
                        <input
                            type="text"
                            id="epp-elemento"
                            className="epp-input"
                            value={referencia_tipo}
                            onChange={(e) => setReferencia_tipo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label htmlFor="epp-cantidad">Cantidad:</label>
                        <input
                            type="number"
                            id="epp-cantidad"
                            className="epp-input"
                            value={unidadesEntregadas}
                            onChange={(e) => setUnidadesEntregadas(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label htmlFor="epp-labor">Labor:</label>
                        <input
                            type="text"
                            id="epp-labor"
                            className="epp-input"
                            value={tareaLabor}
                            onChange={(e) => setTareaLabor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label htmlFor="epp-firma">Firma Digital:</label>
                        <canvas
                            id="epp-firma"
                            className="epp-firma"
                            width="500"
                            height="200"
                        ></canvas>
                        <button
                            type="button"
                            id="epp-limpiar-firma"
                            className="epp-button"
                            onClick={handleLimpiarFirma}
                        >
                            Limpiar Firma
                        </button>
                    </div>
                    <div className="epp-buttons">
                        <button
                            type="button"
                            id="epp-cancelar"
                            className="epp-button epp-button-cancel"
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="epp-button epp-button-add">
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EntregaEPP;