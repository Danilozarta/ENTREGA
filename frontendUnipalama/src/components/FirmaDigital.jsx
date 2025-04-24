import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import wacomstu430 from './wacomstu430';

const FirmaDigital = forwardRef(({ onFirmaGuardada }, ref) => {
    const canvasRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [firmaGuardada, setFirmaGuardada] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [signatureMode, setSignatureMode] = useState(null); // 'wacom' o 'touch'
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
        setSignatureMode(null);
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

    // Configurar eventos táctiles
    const setupTouchEvents = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Limpiar eventos anteriores
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);

        // Configurar nuevos eventos
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        if (signatureMode !== 'touch') return;
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        isDrawingRef.current = true;
        lastPosRef.current = { x, y };
        context.beginPath();
        context.moveTo(x, y);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (!isDrawingRef.current || signatureMode !== 'touch') return;
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        context.lineTo(x, y);
        context.stroke();
        lastPosRef.current = { x, y };
    };

    const handleTouchEnd = () => {
        isDrawingRef.current = false;
    };

    // Conectar tableta Wacom
    const connectToTablet = async () => {
        try {
            if (wacomRef.current?.checkConnected?.()) {
                setShowModal(true);
                setConnectionStatus('connected');
                setSignatureMode('wacom');
                return;
            }

            setSignatureMode('wacom');
            setConnectionStatus('connecting');
            setShowModal(true);
            
            wacomRef.current = new wacomstu430();
            const wacom = wacomRef.current;

            if (!await wacom.connect()) {
                throw new Error("No se pudo conectar a la tableta");
            }

            // Configurar eventos de la pluma
            wacom.onPenData((pen) => {
                if (!canvasRef.current || signatureMode !== 'wacom') return;
                
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

    // Iniciar firma táctil
    const startTouchSignature = () => {
        setSignatureMode('touch');
        setShowModal(true);
        initCanvas();
        setupTouchEvents();
    };

    useEffect(() => {
        if (showModal) {
            initCanvas();
            if (signatureMode === 'touch') {
                setupTouchEvents();
            }
        }
    }, [showModal, signatureMode]);

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
        
        if (wacomRef.current?.checkConnected?.() && signatureMode === 'wacom') {
            try {
                await wacomRef.current.clearScreen();
            } catch (e) {
                console.warn("Error clearing tablet screen:", e);
            }
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
                <div className="firma-options">
                    <button 
                        type="button" 
                        onClick={connectToTablet}
                        className="epp-button conectar"
                    >
                        Conectar Tableta
                    </button>
                    <button 
                        type="button" 
                        onClick={startTouchSignature}
                        className="epp-button touch"
                    >
                        Firmar con Dedo
                    </button>
                </div>
            )}

            {showModal && (
                <div className="firma-modal-overlay">
                    <div className="firma-modal-content">
                        {connectionStatus === 'connecting' && signatureMode === 'wacom' && (
                            <div className="firma-loading">Conectando con la tableta...</div>
                        )}
                        {connectionStatus === 'error' && signatureMode === 'wacom' && (
                            <div className="firma-error">Error de conexión</div>
                        )}
                        
                        <div className="firma-mode-indicator">
                            {signatureMode === 'wacom' ? 'Modo Tableta' : 'Modo Táctil'}
                        </div>
                        
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
                                disabled={signatureMode === 'wacom' && connectionStatus !== 'connected'}
                            >
                                Limpiar
                            </button>
                            <button 
                                type="button" 
                                onClick={handleGuardarFirma}
                                className="epp-button guardar"
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