import { Request, Response } from 'express';
import pool from '../config/db';

// Add Estimate
export const addEstimate = async (req: Request, res: Response): Promise<void> => {
  const { projectId, estimatedCost, deadline } = req.body;
  try {
    // Validate projectId
    const projectResult = await pool.query(`SELECT id FROM projects WHERE id = $1`, [projectId]);
    if (projectResult.rows.length === 0) {
      res.status(400).json({ error: `Project with ID ${projectId} does not exist.` });
      return;
    }

    // Insert estimate
    const result = await pool.query(
      `INSERT INTO estimates (project_id, estimated_cost, deadline) 
       VALUES ($1, $2, $3) RETURNING id`,
      [projectId, estimatedCost, deadline]
    );
    res.status(201).json({
      message: 'Estimate created successfully.',
      estimateId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error adding estimate:', error);
    res.status(500).json({ error: 'Database error while adding estimate.' });
  }
};

// Get All Estimates
export const getAllEstimates = async (req: Request, res: Response): Promise<void> => {
  try {
      // Query the database to get all estimates
      const result = await pool.query(
          `SELECT id AS "estimateId", project_id AS "projectId", estimated_cost AS "estimatedCost", 
                  deadline 
           FROM estimates`
      );

      // Return all estimates
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching all estimates:', error);
      res.status(500).json({ error: 'Database error while fetching estimates.' });
  }
};


// Get Estimates by Assigned User
export const getEstimatesByAssignedUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body; // assuming the value is passed in the request body

  try {
      // Validate that userId is provided
      if (!userId) {
          res.status(400).json({ error: 'Missing required parameter: userId' });
          return;
      }

      // Query the database for estimates related to projects assigned to the specified user
      const result = await pool.query(
          `SELECT e.id AS "estimateId", e.project_id AS "projectId", e.estimated_cost AS "estimatedCost", 
                  e.deadline 
           FROM estimates e
           INNER JOIN projects p ON e.project_id = p.id
           INNER JOIN users u ON u.id = ANY(p.assigned_to)
           WHERE u.id = $1`,
          [userId]
      );

      if (result.rows.length === 0) {
          res.status(404).json({ error: `No estimates found for user ID ${userId}.` });
          return;
      }

      // Return the estimates
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching estimates for user:', error);
      res.status(500).json({ error: 'Database error while fetching estimates.' });
  }
};


// Get Estimates by Project
export const getEstimatesByProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id AS "estimateId", project_id AS "projectId", estimated_cost AS "estimatedCost", 
              deadline 
       FROM estimates WHERE project_id = $1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: `No estimates found for project ID ${projectId}.` });
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    res.status(500).json({ error: 'Database error while fetching estimates.' });
  }
};
