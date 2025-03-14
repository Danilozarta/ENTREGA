import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { format, parse } from "date-fns";
//import {wacomstu430} from './wacomstu430';
//import Wacom from "wacom";
// import WacomSignatureSDK from "javascript-signature-sdk";
//import * as WacomSignatureSDK from "javascript-signature-sdk";
import WacomSignatureSDK from "javascript-signature-sdk";


const EntregaEPP = () => {
    const [cedula, setCedula] = useState('');
    const [trabajador, setTrabajador] = useState(null);
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [eppEntregado, setEppEntregado] = useState('');
    const [referencia_tipo, setReferencia_tipo] = useState('');
    const [unidadesEntregadas, setUnidadesEntregadas] = useState('');
    const [nombreEntrega, setNombreEntrega] = useState('');
    const [tareaLabor, setTareaLabor] = useState('');

    // Referencia al canvas para la firma
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    // Estado para la tableta Wacom
   // const [wacom, setWacom] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    //const [isConnected, setIsConnected] = useState(false); // Estado para verificar si la tableta está conectada


    // Recuperar el nombre del usuario al cargar el componente
    useEffect(() => {
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        if (nombreUsuario) {
            setNombreEntrega(nombreUsuario);
        } else {
            console.error('No se encontró el nombre del usuario en la sesión.');
        }

        // Inicializar el canvas y la tableta Wacom
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        contextRef.current = context;

    //      // Inicializar la tableta Wacom
    //      WacomSignatureSDK.connect().then(() => {
    //         console.log('Wacom SDK inicializado correctamente');
    //     }).catch(error => {
    //         console.error('Error al inicializar el SDK de Wacom:', error);
    //     });

    //     // Configurar el listener para los datos de la pluma
    //     WacomSignatureSDK.onPenData((data) => {
    //         const drawX = data.x * (canvas.width / 9600);
    //         const drawY = data.y * (canvas.height / 6000);

    //         if (data.pressure > 0) {
    //             if (!isDrawing) {
    //                 setIsDrawing(true);
    //                 setLastX(drawX);
    //                 setLastY(drawY);
    //             } else {
    //                 context.beginPath();
    //                 context.moveTo(lastX, lastY);
    //                 context.lineTo(drawX, drawY);
    //                 context.strokeStyle = "#000000";
    //                 context.lineWidth = 2 + (data.pressure - 35) / 20;
    //                 context.stroke();
    //                 setLastX(drawX);
    //                 setLastY(drawY);
    //             }
    //         } else {
    //             setIsDrawing(false);
    //         }
    //     });

    //     return () => {
    //         // Limpiar la tableta Wacom al desmontar el componente
    //         WacomSignatureSDK.clear();
    //     };

    //     // const wacomInstance = new wacomstu430();
    //     // setWacom(wacomInstance);

    //     // // Configurar la tableta Wacom
    //     // wacomInstance.onPenData((pen) => {
    //     //     if (pen.press > 35) { // Sensibilidad de la presión
    //     //         const drawX = pen.cx * (canvas.width / 9600);
    //     //         const drawY = pen.cy * (canvas.height / 6000);

    //     //         if (!isDrawing) {
    //     //             setIsDrawing(true);
    //     //             setLastX(drawX);
    //     //             setLastY(drawY);
    //     //         } else {
    //     //             context.beginPath();
    //     //             context.moveTo(lastX, lastY);
    //     //             context.lineTo(drawX, drawY);
    //     //             context.strokeStyle = "#000000";
    //     //             context.lineWidth = 2 + (pen.press - 35) / 20;
    //     //             context.stroke();
    //     //             setLastX(drawX);
    //     //             setLastY(drawY);
    //     //         }
    //     //     } else {
    //     //         setIsDrawing(false);
    //     //     }
    //     // });

    //     // return () => {
    //     //     // Limpiar la tableta Wacom al desmontar el componente
    //     //     wacomInstance.clearScreen();
    //     // };
    }, [isDrawing, lastX, lastY]);

    // Función para limpiar la firma
    // const handleLimpiarFirma = () => {
    //     contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // };

    // const handleCancelar = () => {
    //     console.log("Operación cancelada");
    // };

    //  // Función para conectar la tableta Wacom
    //  const handleConectarTableta = async () => {
    //     try {
    //         // Verificar si la tableta ya está conectada
    //         if (wacom && wacom.checkConnected()) {
    //             Swal.fire('Advertencia', 'La tableta ya está conectada', 'warning');
    //             return;
    //         }

    //         const wacomInstance = new wacomstu430();
    //         const connected = await wacomInstance.connect();

    //         if (connected) {
    //             setWacom(wacomInstance);
    //             setIsConnected(true);
    //             Swal.fire('Éxito', 'Tableta Wacom conectada correctamente', 'success');

    //             // Configurar la tableta Wacom
    //             await wacomInstance.clearScreen();
    //             await wacomInstance.setWritingMode(1);
    //             await wacomInstance.setWritingArea({ x1: 0, y1: 0, x2: 320, y2: 200 });
    //             await wacomInstance.setInking(true);
    //             await wacomInstance.setPenColorAndWidth("#000000", 2);

    //             // Configurar el listener para los datos de la pluma
    //             wacomInstance.onPenData((pen) => {
    //                 if (pen.press > 35) { // Sensibilidad de la presión
    //                     const drawX = pen.cx * (canvasRef.current.width / 9600);
    //                     const drawY = pen.cy * (canvasRef.current.height / 6000);

    //                     if (!isDrawing) {
    //                         setIsDrawing(true);
    //                         setLastX(drawX);
    //                         setLastY(drawY);
    //                     } else {
    //                         contextRef.current.beginPath();
    //                         contextRef.current.moveTo(lastX, lastY);
    //                         contextRef.current.lineTo(drawX, drawY);
    //                         contextRef.current.strokeStyle = "#000000";
    //                         contextRef.current.lineWidth = 2 + (pen.press - 35) / 20;
    //                         contextRef.current.stroke();
    //                         setLastX(drawX);
    //                         setLastY(drawY);
    //                     }
    //                 } else {
    //                     setIsDrawing(false);
    //                 }
    //             });
    //         } else {
    //             Swal.fire('Error', 'No se pudo conectar la tableta Wacom', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Error al conectar la tableta Wacom:', error);
    //         Swal.fire('Error', 'Hubo un problema al conectar la tableta Wacom', 'error');
    //     }
    // };

     // Función para limpiar la firma
     const handleLimpiarFirma = async () => {
        if (wacom) {
            await wacom.clearScreen();
        }
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const handleCancelar = () => {
        console.log("Operación cancelada");
    };


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

            Swal.fire('Éxito', 'Entrega de EPP registrada correctamente', 'success');
        } catch (error) {
            console.error('Error al registrar la entrega de EPP:', error);
            Swal.fire('Error', error.message || 'Hubo un problema al registrar la entrega de EPP', 'error');
        }
    };

   
    return (
        <div className="body-epp">
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
                        <canvas
                            id="epp-firma"
                            className="epp-firma"
                            width="500"
                            height="200"
                            ref={canvasRef}
                        ></canvas>
                         {/* Botón para conectar la tableta Wacom */}
                       
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