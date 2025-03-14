// frontend/src/components/FirmaDigital.jsx
import React, { useEffect, useRef } from 'react';
import wacomstu430 from './wacomstu430'; // Importa el archivo wacomstu430.js

const FirmaDigital = ({ onFirmaGuardada }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Inicializar la tableta Wacom
        const wacom = new wacomstu430(); // Usa la importación directa

        // Variables para el dibujo
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const rawMaxX = 9600;
        const rawMaxY = 6000;
        const scaleX = canvas.width / rawMaxX;
        const scaleY = canvas.height / rawMaxY;
        const sensitivityThreshold = 35;

        // Conectar la tableta Wacom
        const connectWacom = async () => {
            if (await wacom.connect()) {
                console.log("Conectado a la STU‑430");
                await wacom.clearScreen();
                await wacom.setWritingMode(1);
                await wacom.setWritingArea({ x1: 0, y1: 0, x2: 320, y2: 200 });
                await wacom.setInking(true);
                await wacom.setPenColorAndWidth("#000000", 2);
            }
        };

        // Manejar los datos de la pluma
        wacom.onPenData((pen) => {
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

        // Limpiar el canvas
        const limpiarFirma = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };

        // Guardar la firma
        const guardarFirma = () => {
            const dataURL = canvas.toDataURL('image/png');
            onFirmaGuardada(dataURL);
        };

        // Event listeners
        document.getElementById('connectBtn').addEventListener('click', connectWacom);
        document.getElementById('clearBtn').addEventListener('click', limpiarFirma);
        document.getElementById('saveButton').addEventListener('click', guardarFirma);

        // Limpiar event listeners al desmontar el componente
        return () => {
            document.getElementById('connectBtn').removeEventListener('click', connectWacom);
            document.getElementById('clearBtn').removeEventListener('click', limpiarFirma);
            document.getElementById('saveButton').removeEventListener('click', guardarFirma);
        };
    }, [onFirmaGuardada]);

    return (
        <div>
            <canvas ref={canvasRef} id="signatureCanvas" width="500" height="200"></canvas>
            <button id="connectBtn">Conectar</button>
            <button id="clearBtn">Limpiar Firma</button>
            <button id="saveButton">Guardar Firma</button>
        </div>
    );
};

export default FirmaDigital;