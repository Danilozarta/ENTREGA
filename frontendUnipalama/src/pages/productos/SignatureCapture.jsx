import React, { useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { wacomstu430 } from './wacomstu430'; // Importar la clase wacomstu430

const SignatureCapture = ({ onSaveSignature }) => {
    const canvasRef = useRef(null);
    const wacomRef = useRef(null);
    const isDrawingRef = useRef(false);
    const lastXRef = useRef(0);
    const lastYRef = useRef(0);

    useEffect(() => {
        // Inicializar la tableta Wacom
        wacomRef.current = new wacomstu430();

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const rawMaxX = 9600;
        const rawMaxY = 6000;
        const scaleX = canvas.width / rawMaxX;
        const scaleY = canvas.height / rawMaxY;
        const sensitivityThreshold = 35;

        // Función para conectar la tableta Wacom
        const connectTablet = async () => {
            try {
                // Verificar si el dispositivo ya está conectado
                if (wacomRef.current.checkConnected()) {
                    console.log("La tableta ya está conectada.");
                    return;
                }

                // Conectar la tableta
                if (await wacomRef.current.connect()) {
                    console.log("Conectado a la tableta Wacom");

                    // Configurar la tableta
                    await wacomRef.current.clearScreen();
                    await wacomRef.current.setWritingMode(1);
                    await wacomRef.current.setWritingArea({ x1: 0, y1: 0, x2: 320, y2: 200 });
                    await wacomRef.current.setInking(true);
                    await wacomRef.current.setPenColorAndWidth("#000000", 2);

                    // Manejar los datos de la pluma
                    wacomRef.current.onPenData(function (pen) {
                        if (pen.press > sensitivityThreshold) {
                            const drawX = pen.cx * scaleX;
                            const drawY = pen.cy * scaleY;

                            if (!isDrawingRef.current) {
                                isDrawingRef.current = true;
                                lastXRef.current = drawX;
                                lastYRef.current = drawY;
                            } else {
                                context.beginPath();
                                context.moveTo(lastXRef.current, lastYRef.current);
                                context.lineTo(drawX, drawY);
                                const dynamicLineWidth = 2 + (pen.press - sensitivityThreshold) / 20;
                                context.strokeStyle = "#000000";
                                context.lineWidth = dynamicLineWidth;
                                context.stroke();
                                lastXRef.current = drawX;
                                lastYRef.current = drawY;
                            }
                        } else {
                            isDrawingRef.current = false;
                        }
                    });
                } else {
                    console.error("No se pudo conectar a la tableta Wacom");
                    Swal.fire('Error', 'No se pudo conectar a la tableta Wacom. Asegúrate de que el dispositivo esté conectado y que el navegador tenga los permisos necesarios.', 'error');
                }
            } catch (error) {
                console.error("Error al conectar la tableta:", error);
                Swal.fire('Error', 'Hubo un problema al conectar la tableta. Asegúrate de que el dispositivo esté conectado y que el navegador tenga los permisos necesarios.', 'error');
            }
        };

        // Conectar la tableta al hacer clic en el botón
        const connectBtn = document.getElementById('connectBtn');
        if (connectBtn) {
            connectBtn.addEventListener('click', connectTablet);
        }

        // Limpiar la firma al hacer clic en el botón
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                if (wacomRef.current.checkConnected()) {
                    await wacomRef.current.clearScreen();
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
            });
        }

        // Guardar la firma al hacer clic en el botón
        const saveButton = document.getElementById('saveButton');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const dataURL = canvas.toDataURL('image/png');
                onSaveSignature(dataURL);
            });
        }

        // Limpiar eventos al desmontar el componente
        return () => {
            if (connectBtn) connectBtn.removeEventListener('click', connectTablet);
            if (clearBtn) clearBtn.removeEventListener('click', clearBtn);
            if (saveButton) saveButton.removeEventListener('click', saveButton);
        };
    }, [onSaveSignature]);

    return (
        <div>
            <button id="connectBtn">Conectar Tableta Wacom</button>
            <button id="clearBtn">Limpiar Firma</button>
            <button id="saveButton">Guardar Firma</button>
            <canvas
                ref={canvasRef}
                width="500"
                height="200"
                style={{ border: '1px solid black' }}
            ></canvas>
        </div>
    );
};

export default SignatureCapture;