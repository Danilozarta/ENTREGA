import EntregaEPP from '../models/EntregaEPP.js'; // Importar el modelo
import { parse } from 'date-fns'; // Importar la función parse de date-fns

const registrarEntregaEPP = async (req, res) => {
    const { trabajador, fecha_entrega, epp_entregado, referencia_tipo, nombre_entrega, tarea_labor, firma } = req.body;
    console.log("Datos recibidos:", req.body); // Depuración

    try {
        // Convertir el string a Date (formato: "dd/MM/yyyy HH:mm:ss")
        const fechaEntregaDate = parse(fecha_entrega, 'dd/MM/yyyy HH:mm:ss', new Date());
        console.log("Fecha convertida:", fechaEntregaDate); // Depuración

        // Convertir el objeto Date a un formato reconocido por Mongoose (ISO 8601)
        const fechaISO = fechaEntregaDate.toISOString();


        // Crear la entrega de EPP en la base de datos
        const entrega = new EntregaEPP({
            trabajador,
            fecha_entrega: fechaEntregaDate, // Usar el objeto Date
            epp_entregado,
            referencia_tipo,
            nombre_entrega,
            tarea_labor,
            firma,
        });

        await entrega.save();

        res.json({ success: true, message: 'Entrega de EPP registrada correctamente' });
    } catch (error) {
        console.error('Error al registrar la entrega de EPP:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

export { registrarEntregaEPP };