import Usuario from "../models/Usuario.js";
import emailRegistro from "../helper/emailRegistro.js";
import generarJWT from "../helper/generarJWT.js";
import emailOlvidePassword from "../helper/emailOlvidePassword.js";
import bcrypt from "bcrypt";

const prueba = (req, res)=>{
    res.send({
        msg:"En esta ruta gestionaremos todas las peticiones correspondiente al modelo de Usuario"
    })    
};

const registrar = async (req, res)=>{

    const { nombre, email, password, telefono, direccion, web, rol } = req.body;

    // Validar usuario duplicado
    const existeUsuario = await Usuario.findOne({email});

    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    };

    try {

        // Crear usuario con rol por defecto 'hs' si no se especifica
        const usuario = new Usuario({
            nombre,
            email,
            password,
            telefono,
            direccion,
            web,
            rol: rol || 'hs' // Rol por defecto
        });

        const usuarioGuardado = await  usuario.save();

        // Enviar el email
        // emailRegistro({
        //     email,
        //     nombre, 
        //     token: usuarioGuardado.token
        // });
        
       // Devolver respuesta sin password y con rol
        res.json({
            _id: usuarioGuardado._id,
            nombre: usuarioGuardado.nombre,
            email: usuarioGuardado.email,
            rol: usuarioGuardado.rol,
            telefono: usuarioGuardado.telefono,
            direccion: usuarioGuardado.direccion,
            web: usuarioGuardado.web
        });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: "Error en el servidor" });
    };
};


const auntenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+confirmado');

    if (!usuario) {
        return res.status(403).json({ msg: "Credenciales inválidas" });
    }

    // Verificar si el usuario está bloqueado
    if (!usuario.confirmado) {
        return res.status(403).json({ 
            msg: "Cuenta bloqueada. Contacte al administrador.",
            errorType: "ACCOUNT_BLOCKED",  // Identificador único para el frontend
        });
    }

    // Revisar el password si es correcto
    if( await usuario.comprobarPassword(password)){
        return res.status(403).json({ msg: "Credenciales inválidas" });
    }
        // Crear token JWT con el rol incluido
        // Generar token con solo el ID (no enviar objeto completo)
        const token = generarJWT(usuario._id.toString()); // Solo el ID como string
        
     
        // Devolver datos relevantes del usuario
        //poner en esta linea los campos que quiero que me devuelva del hs para el formato de entrega EPP(nombre, numero, cedula..etc)
        res.json({ 
            token,
            usuario: {
                _id: usuario._id,
                nombre: usuario.nombre, // Enviar el nombre del usuario
                email: usuario.email,
                rol: usuario.rol,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                web: usuario.web,
                confirmado: usuario.confirmado
            },
            msg: "Usuario auntenticado"    
        });
};

const bloquearUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Cambiar el estado (usando el valor del body o alternarlo)
        const nuevoEstado = req.body.activo !== undefined ? req.body.activo : !usuario.confirmado;
        usuario.confirmado = nuevoEstado;
        usuario.token = undefined; // Invalidar token
        await usuario.save();

        res.json({ 
            msg: nuevoEstado ? 'Usuario desbloqueado' : 'Usuario bloqueado',
            usuarioId: usuario._id,
            confirmado: usuario.confirmado
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al cambiar estado' });
    }
};

const olvidePassword = async (req, res) =>{
    const { email } = req.body; 

    const existeUsuario = await Usuario.findOne({email});

    if(!existeUsuario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({
            status: 'error',
            msg: error.message
        });
    };

    try {
        existeUsuario.token = generarId()
        await existeUsuario.save();

        // Enviar email con Instrucciones
        emailOlvidePassword({
            email,
            nombre: existeUsuario.nombre,
            token: existeUsuario.token
        });

        res.json({msg: "Hemos enviado un email con las instrucciones"});    

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            error: error.message
        });
    }
};

/* Resto de Rutas */
const perfil = (req, res)=>{    

    //Extraemos los datos del usuario almacenado en el servidor de nodejs
    //console.log(req.usuario);

    const { usuario } = req;

    try{

        res.status(200).json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            web: usuario.web
        });
    } catch (error) {
        return res.status(404).json({
            status: 'error',
            error: error.message
        });
    }
};

const usuarioRegistrados = async (req, res) =>{
    
    try {
        // Solo muestra campos necesarios, excluyendo password y otros sensibles
        const usuarios = await Usuario.find()
            .select('-password -token -__v -createdAt -updatedAt');
        
        res.json(usuarios);
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};

const nuevoPassword = async (req, res) =>{
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({token});
    if(!usuario){
        const error = new Error('Hubo un error');
        return res.status(400).json({
            status: 'error',
            msg: error.message
        });
    };

    try {
        usuario.token = null;
        usuario.password = password;
        await usuario.save(); 
        res.json({msg: "Password modificado correctamente"});       
    } catch (error) {
        console.log("error: ", error.message);
        return res.status(404).json({
            status: 'error',
            error: error.message
        });
    };
};

const comprobarToken = async (req, res) =>{
    const { token } = req.params;
    
    const tokenValido = await Usuario.findOne({token});

    if(tokenValido){
        res.json({msg: "Usuario valido"});
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({
            status: 'error',
            msg: error.message
        });
    }

};



const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
  
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
  
    // Solo admin o el mismo usuario puede actualizar
    if (req.usuario.rol !== 'admin' && req.usuario._id.toString() !== id) {
      return res.status(403).json({ msg: "No autorizado" });
    }
  
    // Actualizar Usuario
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.email = req.body.email || usuario.email;
    usuario.telefono = req.body.telefono || usuario.telefono;
    usuario.direccion = req.body.direccion || usuario.direccion;
    usuario.web = req.body.web || usuario.web;
    usuario.rol = req.body.rol || usuario.rol;
    usuario.confirmado = req.body.confirmado !== undefined ? req.body.confirmado : usuario.confirmado;
  
    try {
      const usuarioActualizado = await usuario.save();
      
      // No devolver el password
      const { password, ...usuarioSinPassword } = usuarioActualizado.toObject();
      
      res.json(usuarioSinPassword);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error al actualizar el perfil" });
    }
};

const actualizarPassword = async (req, res) => {
    const { id } = req.params;
    const { nuevaPassword } = req.body;
    const usuarioId = req.usuarioId; // ID del usuario autenticado
  
    // Validaciones básicas
    if (!nuevaPassword || nuevaPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }
  
    try {
      // Buscar usuario
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
  
      // Solo el mismo usuario o un admin puede cambiar la contraseña
      if (usuario._id.toString() !== usuarioId && usuario.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No autorizado para esta acción'
        });
      }
  
      // Encriptar la nueva contraseña (con await si usas bcrypt.hash)
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(nuevaPassword, salt);
      
      // Guardar cambios
      await usuario.save();
      
      res.json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      });
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: error.message
      });
    }
  };

const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
  
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
  
    // Actualizar campos permitidos
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.email = req.body.email || usuario.email;
    usuario.rol = req.body.rol || usuario.rol;
    usuario.confirmado = typeof req.body.confirmado !== 'undefined' ? req.body.confirmado : usuario.confirmado;
  
    try {
      const usuarioActualizado = await usuario.save();
      res.json(usuarioActualizado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error al actualizar usuario" });
    }
};

const cambiarPasswordAdmin = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
  
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
  
    try {
      usuario.password = password;
      await usuario.save();
      res.json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error al cambiar contraseña" });
    }
};


export {
    prueba,
    auntenticar,
    registrar,
    //confirmar,
    perfil,
    olvidePassword,
    usuarioRegistrados,
    nuevoPassword,
    comprobarToken,
    actualizarPassword,
    actualizarPerfil,
    bloquearUsuario,
    actualizarUsuario,
    cambiarPasswordAdmin
};