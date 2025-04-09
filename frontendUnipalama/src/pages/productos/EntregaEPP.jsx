import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import FirmaDigital from '../../components/FirmaDigital';

const EntregaEPP = () => {
    const navigate = useNavigate();
    const [cedula, setCedula] = useState('');
    const [trabajador, setTrabajador] = useState(null);
    const [eppEntregado, setEppEntregado] = useState('');
    const [referencia_tipo, setReferencia_tipo] = useState('');
    const [unidadesEntregadas, setUnidadesEntregadas] = useState('');
    const [nombreEntrega, setNombreEntrega] = useState('');
    const [tareaLabor, setTareaLabor] = useState('');
    const [firma, setFirma] = useState('');
    const [showOpcionesEnvio, setShowOpcionesEnvio] = useState(false);

    // Recuperar el nombre del usuario al cargar el componente
    useEffect(() => {
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        console.log('Nombre del usuario recuperado:', nombreUsuario);

        if (nombreUsuario) {
            setNombreEntrega(nombreUsuario);
        } else {
            console.error('No se encontró el nombre del usuario en la sesión.');
        }
    }, []);

    const handleBuscarTrabajador = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/epp/buscar-trabajador/${cedula}`);
            const data = await response.json();
            if (data.success) {
                setTrabajador(data.trabajador);
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

        if (!trabajador) {
            Swal.fire('Error', 'Debes buscar un trabajador primero', 'error');
            return;
        }

        const fechaHoraActual = new Date().toISOString();

        const entrega = {
            trabajador_id: trabajador._id,
            fecha_entrega: fechaHoraActual,
            epp_entregado: eppEntregado,
            unidades_entregadas: Number(unidadesEntregadas),
            referencia_tipo: referencia_tipo,
            nombre_hs_entrega: nombreEntrega,
            tarea_labor: tareaLabor,
            firma: firma,
        };

        console.log('Datos enviados:', JSON.stringify(entrega, null, 2));

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

            // Mostrar opciones después de envío exitoso
            setShowOpcionesEnvio(true);
        } catch (error) {
            console.error('Error al registrar la entrega de EPP:', error);
            Swal.fire('Error', error.message || 'Hubo un problema al registrar la entrega de EPP', 'error');
        }
    };

    const handleNuevaEntrega = () => {
        // Limpiar todos los campos
        setCedula('');
        setTrabajador(null);
        setEppEntregado('');
        setReferencia_tipo('');
        setUnidadesEntregadas('');
        setTareaLabor('');
        setFirma('');
        setShowOpcionesEnvio(false);
    };

    const handleVolverInicio = () => {
        navigate('/homeHs');
    };

    const handleCancelar = () => {
        navigate('/homeH');
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
                        <label htmlFor="epp-elemento">Referencia/Tipo:</label>
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
                        <FirmaDigital onFirmaGuardada={setFirma} required />
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

                {/* Modal de opciones después de envío exitoso */}
                {showOpcionesEnvio && (
                    <div className="opciones-envio-modal-overlay">
                        <div className="opciones-envio-modal-content">
                            <h3>¡Entrega registrada con éxito!</h3>
                            <p>¿Qué deseas hacer ahora?</p>
                            <div className="opciones-envio-botones">
                                <button 
                                    type="button" 
                                    onClick={handleNuevaEntrega}
                                    className="opcion-button nueva-entrega"
                                >
                                    Nueva Entrega
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleVolverInicio}
                                    className="opcion-button volver-inicio"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Estilos CSS */}
            <style jsx>{`
                .opciones-envio-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0,0,0,0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .opciones-envio-modal-content {
                    background-color: white;
                    padding: 30px;
                    border-radius: 8px;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }

                .opciones-envio-modal-content h3 {
                    color: #4CAF50;
                    margin-top: 0;
                }

                .opciones-envio-botones {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }

                .opcion-button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .opcion-button.nueva-entrega {
                    background-color: #2196F3;
                    color: white;
                }

                .opcion-button.volver-inicio {
                    background-color: #ff9800;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default EntregaEPP;