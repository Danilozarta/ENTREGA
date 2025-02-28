// models/EntregaEPP.js
import mongoose from 'mongoose';

const entregaEPPSchema = new mongoose.Schema({
    trabajador: { type: mongoose.Schema.Types.ObjectId, ref: 'Trabajador', required: true },
    fecha_entrega: { type: Date, required: true }, // lo guarda como date en formato iso
    //fecha_entrega: { type: String, required: true }, // lo guarda como string
    epp_entregado: { type: String, required: true },
    referencia_tipo: { type: String },
    unidades_entregadas: { type: Number, required: true }, // Añadido este campo
    nombre_hs_entrega: { type: String },
    tarea_labor: { type: String },
    huella_digital: { type: String }, // Puede ser una ruta de archivo o un campo BLOB
});

export default mongoose.model('EntregaEPP', entregaEPPSchema);