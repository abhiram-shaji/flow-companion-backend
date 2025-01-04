import { Request, Response } from 'express';
import pool from '../config/db';

// Get Budget by Project
export const getBudgetByProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id AS "budgetId", project_id AS "projectId", budget_limit AS "budgetLimit", 
              current_spend AS "currentSpend", (budget_limit - current_spend) AS "remainingBudget" 
       FROM budgets WHERE project_id = $1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: `Budget for project ID ${projectId} not found.` });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: 'Database error while fetching budget.' });
  }
};

// Update Budget
export const updateBudget = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { budgetLimit, currentSpend } = req.body;
  try {
    const result = await pool.query(
      `UPDATE budgets 
       SET budget_limit = $1, current_spend = $2, updated_at = NOW() 
       WHERE id = $3`,
      [budgetLimit, currentSpend, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: `Budget with ID ${id} not found.` });
      return;
    }

    res.status(200).json({ message: 'Budget updated successfully.' });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Database error while updating budget.' });
  }
};
