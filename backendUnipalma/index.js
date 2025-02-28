// https://expressjs.com/es/
import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import fileupload from 'express-fileupload';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import conectarDB from './config/db.js';

import usuarioRoutes from './routes/usuarioRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';
import eppRoutes from './routes/eppRoutes.js'; // Importa las rutas de EPP

const PORT = process.env.PORT || 4000;

dotenv.config();

// Se le agrega toda la funcionalidad del servidor de express
const app = express();
app.use(express.json());
app.use(bodyParser.json()); // Usar body-parser para analizar el cuerpo de las solicitudes

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: './files'
}));

conectarDB();

// Se utiliza para realizar la comunicacion entre el servidor del frontend y el backend
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del Request esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};
app.use(cors(corsOptions));

// ruta Gestion de Usuarios
app.use('/api/usuarios', usuarioRoutes);

// Gestion de Productos
app.use('/api/productos', productoRoutes);

// Gestion de Ventas
app.use('/api/ventas', ventaRoutes);

// Gestion de EPP
app.use('/api/epp', eppRoutes); // Usa las rutas de EPP

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT} `);
});