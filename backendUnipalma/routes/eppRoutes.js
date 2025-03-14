import express from 'express';
import Trabajador from '../models/Trabajador.js';
import EntregaEPP from '../models/EntregaEPP.js';
import {parse} from "date-fns";

const router = express.Router();

// Ruta para registrar un trabajador
router.post('/registrar-trabajador', async (req, res) => {
    const { nombre, apellido, cedula, cargo, centro_de_operacion, empresa, contacto } = req.body;
    
    try {
         // Verifica que los campos obligatorios no estén vacíos
         if (!nombre || !apellido || !cedula) {
            return res.status(400).json({ success: false, message: 'Nombre, apellido y cédula son campos obligatorios' });
        }
        const nuevoTrabajador = new Trabajador({
            nombre,
            apellido,
            cedula,
            cargo,
            centro_de_operacion,
            empresa,
            contacto,
        });

        await nuevoTrabajador.save();
        res.json({ success: true, message: 'Trabajador registrado correctamente', id: nuevoTrabajador._id });
    } catch (err) {
        console.error('Error al registrar el trabajador:', err);

        // Manejo de errores específicos
        if (err.code === 11000) { // Error de clave duplicada en MongoDB
            res.status(400).json({ success: false, message: 'La cédula ya está registrada' });
        }else if (err.name === 'ValidationError') { // Error de validación de Mongoose
            res.status(400).json({ success: false, message: err.message });
        }else {
            res.status(500).json({ success: false, message: 'Error al registrar el trabajador' });
        }
    }
});

// Ruta para buscar un trabajador por cédula
router.get('/buscar-trabajador/:cedula', async (req, res) => {
    const { cedula } = req.params;

    try {
        const trabajador = await Trabajador.findOne({ cedula });
        if (trabajador) {
            res.json({ success: true, trabajador });
        } else {
            res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
        }
    } catch (err) {
        console.error('Error al buscar el trabajador:', err);
        res.status(500).json({ success: false, message: 'Error al buscar el trabajador' });
    }
});

// Ruta para registrar una entrega de EPP
router.post('/registrar-entrega-epp', async (req, res) => {
    const { trabajador_id, fecha_entrega, epp_entregado, referencia_tipo, unidades_entregadas,nombre_hs_entrega, tarea_labor, huella_digital } = req.body;
    console.log('Datos recibidos:', req.body); // Agrega esto para depuración

    try {
        // Convertir el string a Date (formato: "24/02/2025 19:29:48")
        //const fechaEntregaDate = parse(fecha_entrega, 'dd/MM/yyyy HH:mm:ss', new Date());

        // Crear la entrega de EPP en la base de datos
        const nuevaEntrega = new EntregaEPP({
            trabajador: trabajador_id,
            //fecha_entrega : fechaEntregaDate,
            fecha_entrega,
            epp_entregado,
            referencia_tipo,
            unidades_entregadas,
            nombre_hs_entrega,
            tarea_labor,
            huella_digital,
        });

        await nuevaEntrega.save();
        res.json({ success: true, message: 'Entrega de EPP registrada correctamente' });
    } catch (err) {
        console.error('Error al registrar la entrega de EPP:', err);
        res.status(500).json({ success: false, message: 'Error al registrar la entrega de EPP' });
    }
});

// Obtener entregas por trabajador
router.get("/entregas-por-trabajador/:trabajador_id", async (req, res) => {
    const { trabajador_id } = req.params;
    console.log("Buscando entregas para el trabajador:", trabajador_id); // Depuración

    try {
        // Buscar todas las entregas donde el campo "trabajador" coincida con el ID proporcionado
        const entregas = await EntregaEPP.find({ trabajador: trabajador_id });
        res.json({ success: true, entregas });
    } catch (err) {
        console.error("Error al buscar las entregas:", err);
        res.status(500).json({ success: false, message: "Error al buscar las entregas" });
    }
});

export default router;