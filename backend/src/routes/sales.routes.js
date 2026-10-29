import { Router } from 'express';
import { getSaleAgreement, createSale } from '../controllers/sales.controller.js';

const router = Router();

router.post('/sales', createSale);
router.get('/sales/:saleId/agreement', getSaleAgreement);

export default router;
