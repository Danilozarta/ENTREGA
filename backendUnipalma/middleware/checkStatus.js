import Usuario from '../models/Usuario.js';

const checkStatus = async (req, res, next) => {
    try {
        // Obtener usuario actualizado desde la base de datos
        const usuario = await Usuario.findById(req.usuario._id)
            .select('confirmado');
        
        if (!usuario || usuario.confirmado === false) {
            // Invalida la sesión
            return res.status(403).json({
                msg: 'Tu sesión ha sido terminada (cuenta bloqueada)',
                bloqueado: true
            });
        }
        
        next();
    } catch (error) {
        console.error('Error en verificación de estado:', error);
        res.status(500).json({ msg: 'Error al verificar el estado de la cuenta' });
    }
};

export default checkStatus;