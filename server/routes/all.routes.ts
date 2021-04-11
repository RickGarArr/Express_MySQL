import { Router } from 'express';
import administradorRoutes from './admin.routes';

const rutas = Router();

rutas.use('/admin', administradorRoutes);


export default rutas;