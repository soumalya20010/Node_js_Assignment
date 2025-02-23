import express from 'express';
import { createCompany, getCompany } from '../controllers/companyController.js';

const router = express.Router();

router.post('/', createCompany);
router.get('/:companyId', getCompany);

export default router;