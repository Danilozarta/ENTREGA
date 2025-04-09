import React, { useState, useEffect, useRef } from 'react';
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
    
    // Referencia al componente FirmaDigital para acceder a sus métodos
    const firmaDigitalRef = useRef(null);

    // Recuperar el nombre del usuario al cargar el componente
    useEffect(() => {
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        if (nombreUsuario) {
            setNombreEntrega(nombreUsuario);
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

        const entrega = {
            trabajador_id: trabajador._id,
            fecha_entrega: new Date().toISOString(),
            epp_entregado: eppEntregado,
            unidades_entregadas: Number(unidadesEntregadas),
            referencia_tipo: referencia_tipo,
            nombre_hs_entrega: nombreEntrega,
            tarea_labor: tareaLabor,
            firma: firma,
        };

        try {
            const response = await fetch('http://localhost:4000/api/epp/registrar-entrega-epp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entrega),
            });

            if (!response.ok) {
                throw new Error('Error al registrar la entrega de EPP');
            }

            setShowOpcionesEnvio(true);
        } catch (error) {
            console.error('Error al registrar la entrega de EPP:', error);
            Swal.fire('Error', error.message || 'Hubo un problema al registrar la entrega de EPP', 'error');
        }
    };

    const handleNuevaEntrega = async () => {
        try {
            // Limpiar la firma en el componente FirmaDigital
            if (firmaDigitalRef.current) {
                await firmaDigitalRef.current.limpiarFirmaCompleta();
            }
            
            // Limpiar todos los campos del formulario
            setCedula('');
            setTrabajador(null);
            setEppEntregado('');
            setReferencia_tipo('');
            setUnidadesEntregadas('');
            setTareaLabor('');
            setFirma('');
            setShowOpcionesEnvio(false);
            
            // Limpiar también la tableta Wacom
            if (firmaDigitalRef.current?.wacomRef?.current?.checkConnected()) {
                await firmaDigitalRef.current.wacomRef.current.clearScreen();
            }
        } catch (error) {
            console.error('Error al limpiar para nueva entrega:', error);
            Swal.fire('Error', 'No se pudo limpiar la firma', 'error');
        }
    };

    const handleVolverInicio = () => {
        navigate('/homeHs');
    };

    const handleCancelar = () => {
        navigate('/homeHs');
    };

    return (
        <div className="body-epp">
            {/* Menú de navegación */}
            <nav className="nav-registro">
                <ul className="menu">
                    <li><Link to="/homeHs" className="nav-link-registro">Inicio</Link></li>
                    <li><Link to="/" className="nav-link-registro">Cerrar Sesión</Link></li>
                </ul>
            </nav>

            {/* Contenedor principal */}
            <div className="epp-container">
                <h1 className="epp-title">Entrega de Elementos</h1>

                <div className="epp-search">
                    <input
                        type="text"
                        className="epp-input"
                        placeholder="Ingrese la cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                    <button className="epp-button" onClick={handleBuscarTrabajador}>
                        Buscar
                    </button>
                </div>

                {/* Datos del trabajador */}
                {trabajador && (
                    <div className="epp-datos">
                        <div className="epp-dato"><strong>Nombre:</strong> {trabajador.nombre}</div>
                        <div className="epp-dato"><strong>Apellido:</strong> {trabajador.apellido}</div>
                        <div className="epp-dato"><strong>Cédula:</strong> {trabajador.cedula}</div>
                        <div className="epp-dato"><strong>Área:</strong> {trabajador.area}</div>
                        <div className="epp-dato"><strong>Labor:</strong> {trabajador.labor}</div>
                    </div>
                )}

                {/* Formulario de entrega */}
                <form className="epp-form" onSubmit={handleSubmit}>
                    <div className="epp-form-group">
                        <label>Elemento Entregado:</label>
                        <input
                            type="text"
                            className="epp-input"
                            value={eppEntregado}
                            onChange={(e) => setEppEntregado(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label>Referencia/Tipo:</label>
                        <input
                            type="text"
                            className="epp-input"
                            value={referencia_tipo}
                            onChange={(e) => setReferencia_tipo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            className="epp-input"
                            value={unidadesEntregadas}
                            onChange={(e) => setUnidadesEntregadas(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label>Labor:</label>
                        <input
                            type="text"
                            className="epp-input"
                            value={tareaLabor}
                            onChange={(e) => setTareaLabor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="epp-form-group">
                        <label>Firma Digital:</label>
                        <FirmaDigital 
                            ref={firmaDigitalRef}
                            onFirmaGuardada={setFirma} 
                            required 
                        />
                    </div>
                    <div className="epp-buttons">
                        <button
                            type="button"
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
        </div>
    );
};

export default EntregaEPP;