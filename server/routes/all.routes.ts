import { Router } from 'express';
import administradorRoutes from './admin.routes';
import solicitudRoutes from './solicitud.routes';

const rutas = Router();

rutas.use('/admin', administradorRoutes);
rutas.use('/solicitudes', solicitudRoutes);


export default rutas;