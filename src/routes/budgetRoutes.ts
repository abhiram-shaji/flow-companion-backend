import express from 'express';
import { getBudgetByProject, updateBudget, getAllBudgets, getBudgetsByAssignedUser } from '../controllers/budgetController';

const router = express.Router();

router.get('/project/:projectId', getBudgetByProject); // Get Budget by Project
router.put('/:id', updateBudget); // Update Budget

// Route to fetch all budgets
router.get('/all-budgets', getAllBudgets);

// Route to fetch budgets for a specific user (using request body)
router.post('/assigned-to', getBudgetsByAssignedUser);

export default router;
