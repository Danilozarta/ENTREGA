import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const TimeoutWarning = () => {
    const { 
        showTimeoutWarning, 
        resetTimers, 
        cerrarSesion,
        setShowTimeoutWarning
    } = useContext(AuthContext);

    // Cierre automático si el usuario no responde
    useEffect(() => {
        if (!showTimeoutWarning) return;

        const finalTimer = setTimeout(() => {
            cerrarSesion();
        }, 5 * 60 * 1000); // 5 minutos para responder

        return () => clearTimeout(finalTimer);
    }, [showTimeoutWarning]);

    if (!showTimeoutWarning) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">¡Sesión por expirar!</h3>
                <p className="text-gray-600 mb-6">
                    Tu sesión se cerrará automáticamente por inactividad en 5 minutos.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => {
                            setShowTimeoutWarning(false);
                            cerrarSesion();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cerrar ahora
                    </button>
                    <button
                        onClick={() => {
                            resetTimers();
                            setShowTimeoutWarning(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeoutWarning;