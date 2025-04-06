import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const checkAuth = async (req, res, next) => {
    //console.log(req.headers);
    let token;

    // Verificar si el token existe en los headers
    if (
        req.headers.authorization?.startsWith('Bearer')
    ) {
        // Intentar decifrar el JWT token
        try {
            // Extraer el token
            token = req.headers.authorization.split(" ")[1];

            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Busca y Almacena los datos del usuario dentro de nodejs
            req.usuario = await Usuario.findById(decoded.id)
                 .select("-password -token -confirmado -__v");
            
            // Verificar que el usuario exista
            if (!req.usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }
            //console.log(decoded);
            //console.log(req.usuario);
            return next()

        } catch (error) {
            console.error('Error en autenticación:', error.message);
           // Manejar diferentes tipos de errores
           if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ msg: 'Token expirado' });
            }
            return res.status(403).json({ msg: 'Token no válido' });
        }
    };
    
    // Si no hay token 
    if (!token) {
        const error = new Error('Token no valido o inexistente');
        res.status(401).json({
            status: 'error',
            msg: "Token no proporcionado"
        });
    }
};

// Middleware para verificar roles específicos
const checkRol = (rolesPermitidos = []) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario esté autenticado
            if (!req.usuario) {
                throw new Error('No autenticado');
            }
            
            // Verificar que el usuario tenga un rol permitido
            if (!rolesPermitidos.includes(req.usuario.rol)) {
                throw new Error('No autorizado');
            }
            
            next();
        } catch (error) {
            console.error('Error en verificación de rol:', error.message);
            return res.status(403).json({
                status: 'error',
                msg: 'No tienes permisos para esta acción',
                error: error.message
            });
        }
    };
};

export { checkAuth, checkRol };