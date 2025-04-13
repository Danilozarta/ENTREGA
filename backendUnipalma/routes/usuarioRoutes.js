import express from "express";
import {
  prueba,
  registrar,
  auntenticar,
  perfil,
  usuarioRegistrados,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  olvidePassword,
  actualizarPassword,
  bloquearUsuario, 
  actualizarUsuario,
  cambiarPasswordAdmin
} from "../controllers/usuarioController.js";
import { checkAuth, checkRol } from "../middleware/authMiddleware.js";
import checkStatus from "../middleware/checkStatus.js";
import validarJWT from "../helper/validarJWT.js";

const router = express.Router();
const adminRouter = express.Router();

// ================= RUTAS PÚBLICAS ================= //
router.get("/prueba", prueba);
router.post("/", registrar);
router.post("/login", auntenticar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// ========== RUTAS PROTEGIDAS ========== //
// ---- Para todos los usuarios autenticados ---- //
router.get('/perfil', checkAuth, perfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);
router.get('/', checkAuth, usuarioRegistrados);
router.put('/:id', checkAuth, actualizarPerfil);
router.put('/:id/password', validarJWT, actualizarPassword);

// ========== RUTAS DE ADMINISTRADOR ========== //
// Aplicar middlewares a todas las rutas admin
adminRouter.use(checkAuth, checkRol(['admin']));

// Rutas de administración de usuarios
adminRouter.get("/usuarios", usuarioRegistrados);
adminRouter.put("/usuarios/:id", actualizarPerfil);
adminRouter.put("/usuarios/:id/password", actualizarPassword);
adminRouter.put("/usuarios/:id/estado", bloquearUsuario);

// Montar las rutas admin bajo el prefijo /admin
router.use('/admin', adminRouter);

// Nueva ruta para actualizar usuario (incluye bloquear/desbloquear)
router.put('/:id', actualizarUsuario);

// Ruta para cambiar contraseña desde admin
router.put('/:id/password', cambiarPasswordAdmin);

// ========== RUTAS DE VERIFICACIÓN ========== //
router.get('/verificar-sesion', checkAuth, async (req, res) => {
  try {
      const usuario = await Usuario.findById(req.usuario.id);
      if (!usuario || !usuario.confirmado) {
          return res.status(403).json({ 
              errorType: "ACCOUNT_BLOCKED",
              msg: "Cuenta bloqueada" 
          });
      }
      res.json({ valid: true });
  } catch (error) {
      res.status(500).json({ msg: "Error al verificar sesión" });
  }
});

export default router;