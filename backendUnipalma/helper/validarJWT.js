import jwt from 'jsonwebtoken';
import generarJWT from './generarJWT.js';

export const validarJWT = (req, res, next) => {
  // Obtener el token del header
  const token = req.header('x-token') || req.header('authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    });
  }

  try {
    // Verificar el token
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar el ID del usuario al request
    req.usuarioId = id;
    
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido'
    });
  }
};

export default validarJWT;