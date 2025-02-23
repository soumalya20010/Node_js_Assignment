import express from 'express';
import { createCompany, getCompany } from '../controllers/companyController.js';

const router = express.Router();

router.post('/create', createCompany);
router.get('/:companyId', getCompany);

export default router;