// models/Trabajador.js
import mongoose from 'mongoose';

const trabajadorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    cedula: { type: Number, required: true, unique: true },
    cargo: { type: String },
    centro_de_operacion: { type: String },
    empresa: { type: String },
    contacto: { type: String },
});

export default mongoose.model('Trabajador', trabajadorSchema);