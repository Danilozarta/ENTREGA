import express from "express";
import {
  prueba,
  registrar,
  //confirmar,
  auntenticar,
  perfil,
  usuarioRegistrados,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  olvidePassword,
  actualizarPassword,
} from "../controllers/usuarioController.js";
// middleware para validar el token
import { checkAuth, checkRol} from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= RUTAS PÚBLICAS ================= //
router.get("/prueba", prueba);
router.post("/", registrar); // Registra nuevos usuarios
//router.get("/confirmar/:token", confirmar);
router.post("/login", auntenticar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// ========== RUTAS PROTEGIDAS ========== //
// ---- Para todos los usuarios autenticados ---- //
router.get('/perfil', checkAuth, perfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

// ----- Rutas para Administradores ----- //
const adminRouter = express.Router();

// Aplicar middlewares a todas las rutas admin
adminRouter.use(checkAuth, checkRol(['admin']));

adminRouter.get("/admin/usuarios", usuarioRegistrados);
adminRouter.put("/perfil/:id", actualizarPerfil);

// Montar las rutas admin bajo el prefijo /admin
router.use('/admin', adminRouter);

export default router;
