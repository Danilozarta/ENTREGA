import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import wacomstu430 from './wacomstu430';

const FirmaDigital = forwardRef(({ onFirmaGuardada }, ref) => {
    const canvasRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [firmaGuardada, setFirmaGuardada] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const wacomRef = useRef(null);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
        limpiarFirmaCompleta: async () => {
            await limpiarTodo();
        },
        getWacomInstance: () => wacomRef.current
    }));

    const limpiarTodo = async () => {
        // Limpiar canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Limpiar tableta Wacom si está conectada
        if (wacomRef.current?.checkConnected?.()) {
            try {
                await wacomRef.current.clearScreen();
            } catch (e) {
                console.error("Error al limpiar tableta:", e);
                throw e;
            }
        }
        
        // Limpiar estados
        setFirmaGuardada(null);
        if (onFirmaGuardada) {
            onFirmaGuardada(null);
        }
    };

    // Inicializar canvas
    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    };

    // Conectar tableta Wacom
    const connectToTablet = async () => {
        try {
            if (wacomRef.current?.checkConnected?.()) {
                setShowModal(true);
                setConnectionStatus('connected');
                return;
            }

            setConnectionStatus('connecting');
            setShowModal(true);
            
            wacomRef.current = new wacomstu430();
            const wacom = wacomRef.current;

            if (!await wacom.connect()) {
                throw new Error("No se pudo conectar a la tableta");
            }

            // Configurar eventos de la pluma
            wacom.onPenData((pen) => {
                if (!canvasRef.current) return;
                
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                const sensitivityThreshold = 35;
                const rawMaxX = 9600;
                const rawMaxY = 6000;
                const scaleX = canvas.width / rawMaxX;
                const scaleY = canvas.height / rawMaxY;

                if (pen.press > sensitivityThreshold) {
                    const drawX = pen.cx * scaleX;
                    const drawY = pen.cy * scaleY;

                    if (!isDrawingRef.current) {
                        isDrawingRef.current = true;
                        context.beginPath();
                        context.moveTo(drawX, drawY);
                    } else {
                        context.lineTo(drawX, drawY);
                        context.lineWidth = 2 + (pen.press - sensitivityThreshold) / 20;
                        context.stroke();
                    }
                    lastPosRef.current = { x: drawX, y: drawY };
                } else {
                    isDrawingRef.current = false;
                }
            });

            // Configuración inicial
            await wacom.clearScreen().catch(e => console.warn("Error clearing screen:", e));
            await wacom.setWritingMode(1).catch(e => console.warn("Error setting writing mode:", e));
            await wacom.setWritingArea({ x1: 0, y1: 0, x2: 320, y2: 200 }).catch(e => console.warn("Error setting writing area:", e));
            await wacom.setInking(true).catch(e => console.warn("Error setting inking mode:", e));
            await wacom.setPenColorAndWidth("#000000", 2).catch(e => console.warn("Error setting pen color:", e));

            setConnectionStatus('connected');
        } catch (error) {
            console.error("Error al conectar tableta:", error);
            setConnectionStatus('error');
            setShowModal(false);
            if (error.message !== "The device is already open") {
                alert("No se pudo conectar a la tableta. Asegúrese de haber concedido los permisos necesarios.");
            }
        }
    };

    useEffect(() => {
        if (showModal) {
            initCanvas();
        }
    }, [showModal]);

    const handleGuardarFirma = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataURL = canvas.toDataURL('image/png');
        setFirmaGuardada(dataURL);
        onFirmaGuardada(dataURL);
        setShowModal(false);
    };

    const handleLimpiarFirma = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        if (wacomRef.current?.checkConnected?.()) {
            try {
                await wacomRef.current.clearScreen();
            } catch (e) {
                console.warn("Error clearing tablet screen:", e);
            }
        }
        setFirmaGuardada(null);
        if (onFirmaGuardada) {
            onFirmaGuardada(null);
        }
    };

    const handleEliminarFirma = async () => {
        setFirmaGuardada(null);
        onFirmaGuardada(null);
        if (wacomRef.current?.checkConnected?.()) {
            try {
                await wacomRef.current.clearScreen();
            } catch (e) {
                console.warn("Error clearing tablet screen:", e);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (wacomRef.current?.checkConnected?.()) {
                wacomRef.current.clearScreen();
            }
        };
    }, []);

    return (
        <div className="firma-container">
            {firmaGuardada ? (
                <div className="firma-preview">
                    <img src={firmaGuardada} alt="Firma guardada" className="firma-imagen" />
                    <button 
                        type="button" 
                        onClick={handleEliminarFirma}
                        className="epp-button eliminar"
                    >
                        Eliminar Firma
                    </button>
                </div>
            ) : (
                <button 
                    type="button" 
                    onClick={connectToTablet}
                    className="epp-button conectar"
                >
                    Conectar y Firmar
                </button>
            )}

            {showModal && (
                <div className="firma-modal-overlay">
                    <div className="firma-modal-content">
                        {connectionStatus === 'connecting' && (
                            <div className="firma-loading">Conectando con la tableta...</div>
                        )}
                        {connectionStatus === 'error' && (
                            <div className="firma-error">Error de conexión</div>
                        )}
                        
                        <canvas 
                            ref={canvasRef}
                            width={500}
                            height={200}
                            className="firma-canvas"
                        />
                        <div className="firma-modal-controls">
                            <button 
                                type="button" 
                                onClick={handleLimpiarFirma}
                                className="epp-button limpiar"
                                disabled={connectionStatus !== 'connected'}
                            >
                                Limpiar
                            </button>
                            <button 
                                type="button" 
                                onClick={handleGuardarFirma}
                                className="epp-button guardar"
                                disabled={connectionStatus !== 'connected'}
                            >
                                Guardar Firma
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default FirmaDigital;