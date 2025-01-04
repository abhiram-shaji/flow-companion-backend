import express from 'express';
import { getBudgetByProject, updateBudget } from '../controllers/budgetController';

const router = express.Router();

router.get('/project/:projectId', getBudgetByProject); // Get Budget by Project
router.put('/:id', updateBudget); // Update Budget

export default router;
