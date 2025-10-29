import { Router } from "express";
import customerController from "../controllers/customerController.js";
// import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Todas las rutas requieren autenticación
// router.use(authenticateToken);

// Buscar cliente por identificador
router.get('/find/:identifier', customerController.findByIdentifier);

// Buscar clientes (autocompletar)
router.get('/search', customerController.searchCustomers);

// CRUD básico
router.get('/stats', customerController.getStats);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerController.createOrUpdate);
router.put('/:id/status', customerController.toggleStatus);
router.delete('/:id', customerController.deleteCustomer);

export default router;