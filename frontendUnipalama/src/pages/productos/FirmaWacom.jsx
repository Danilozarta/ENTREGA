import { wacomstu430 } from './wacomstu430';
import React, { useRef, useState, useEffect } from 'react';
// import { wacomstu430 } from './wacomstu430';

const FirmaWacom = ({ onFirmaCapturada }) => {
    const canvasRef = useRef(null); // Referencia al canvas
    const [wacom, setWacom] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isCanvasReady, setIsCanvasReady] = useState(false); // Estado para verificar si el canvas está listo

    // Efecto para limpiar el canvas cuando esté disponible
    useEffect(() => {
        if (isConnected && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Limpiar el canvas inicialmente
            context.clearRect(0, 0, canvas.width, canvas.height);
            setIsCanvasReady(true); // Marcar el canvas como listo
        }
    }, [isConnected]); // Este efecto se ejecuta cuando isConnected cambia

    const connectWacom = async () => {
        if (isConnected) {
            console.log("La tableta ya está conectada.");
            return;
        }

        const wacomInstance = new wacomstu430();
        try {
            if (await wacomInstance.connect()) {
                console.log("Conectado a la tableta Wacom");
                setIsConnected(true);
                setWacom(wacomInstance);

                // Verificar nuevamente si el canvas está disponible
                const canvas = canvasRef.current;
                if (!canvas) {
                    console.error("El canvas no está disponible.");
                    return;
                }

                const context = canvas.getContext('2d');

                const rawMaxX = 9600;
                const rawMaxY = 6000;
                const scaleX = canvas.width / rawMaxX;
                const scaleY = canvas.height / rawMaxY;
                const sensitivityThreshold = 35;

                let isDrawing = false;
                let lastX = 0;
                let lastY = 0;

                wacomInstance.onPenData((pen) => {
                    if (pen.press > sensitivityThreshold) {
                        const drawX = pen.cx * scaleX;
                        const drawY = pen.cy * scaleY;

                        if (!isDrawing) {
                            isDrawing = true;
                            [lastX, lastY] = [drawX, drawY];
                        } else {
                            context.beginPath();
                            context.moveTo(lastX, lastY);
                            context.lineTo(drawX, drawY);
                            const dynamicLineWidth = 2 + (pen.press - sensitivityThreshold) / 20;
                            context.strokeStyle = "#000000";
                            context.lineWidth = dynamicLineWidth;
                            context.stroke();
                            [lastX, lastY] = [drawX, drawY];
                        }
                    } else {
                        isDrawing = false;
                    }
                });

                // Configuración inicial de la tableta
                await wacomInstance.clearScreen();
                await wacomInstance.setWritingMode(1);
                await wacomInstance.setWritingArea({ x1: 0, y1: 0, x2: 320, y2: 200 });
                await wacomInstance.setInking(true);
                await wacomInstance.setPenColorAndWidth("#000000", 2);
            } else {
                console.error("No se pudo conectar a la tableta Wacom");
            }
        } catch (error) {
            console.error("Error al configurar la tableta:", error);
            setIsConnected(false); // Reiniciar el estado de conexión en caso de error
        }
    };

    const disconnectWacom = async () => {
        if (wacom && wacom.checkConnected()) {
            await wacom.disconnect();
            setIsConnected(false);
            console.log("Tableta desconectada.");
        }
    };

    const handleLimpiarFirma = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("El canvas no está disponible.");
            return;
        }
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleGuardarFirma = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("El canvas no está disponible.");
            return;
        }
        const dataURL = canvas.toDataURL('image/png');
        onFirmaCapturada(dataURL);
    };

    return (
        <div>
            {!isConnected ? (
                <button type="button" onClick={connectWacom}>
                    Conectar Tableta Wacom
                </button>
            ) : (
                <div>
                    {isCanvasReady && ( // Renderizar el canvas solo si está listo
                        <canvas
                            ref={canvasRef} // Asignar la referencia al canvas
                            width="500"
                            height="200"
                            style={{ border: '1px solid #000' }}
                        ></canvas>
                    )}
                    <button type="button" onClick={handleLimpiarFirma}>
                        Limpiar Firma
                    </button>
                    <button type="button" onClick={handleGuardarFirma}>
                        Guardar Firma
                    </button>
                    <button type="button" onClick={disconnectWacom}>
                        Desconectar Tableta
                    </button>
                </div>
            )}
        </div>
    );
};

export default FirmaWacom;