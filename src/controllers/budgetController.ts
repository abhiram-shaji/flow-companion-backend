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

// Get All Budgets
export const getAllBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
      // Query the database to get all budgets
      const result = await pool.query(
          `SELECT id AS "budgetId", project_id AS "projectId", budget_limit AS "budgetLimit", 
                  current_spend AS "currentSpend", (budget_limit - current_spend) AS "remainingBudget" 
           FROM budgets`
      );

      // Return all budgets
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching all budgets:', error);
      res.status(500).json({ error: 'Database error while fetching budgets.' });
  }
};

// Get Budgets by Assigned User
export const getBudgetsByAssignedUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body; // assuming the value is passed in the request body

  try {
      // Validate that userId is provided
      if (!userId) {
          res.status(400).json({ error: 'Missing required parameter: userId' });
          return;
      }

      // Query the database for budgets related to projects assigned to the specified user
      const result = await pool.query(
          `SELECT b.id AS "budgetId", b.project_id AS "projectId", b.budget_limit AS "budgetLimit", 
                  b.current_spend AS "currentSpend", (b.budget_limit - b.current_spend) AS "remainingBudget" 
           FROM budgets b
           INNER JOIN projects p ON b.project_id = p.id
           INNER JOIN users u ON u.id = ANY(p.assigned_to)
           WHERE u.id = $1`,
          [userId]
      );

      if (result.rows.length === 0) {
          res.status(404).json({ error: `No budgets found for user ID ${userId}.` });
          return;
      }

      // Return the budgets
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching budgets for user:', error);
      res.status(500).json({ error: 'Database error while fetching budgets.' });
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
