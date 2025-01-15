import { Request, Response } from 'express';
import pool from '../config/db';

// Add Project
export const addProject = async (req: Request, res: Response) => {
  const { name, budget, startDate, endDate } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (name, budget, start_date, end_date) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, budget, startDate, endDate]
    );
    res.status(201).json({
      message: 'Project created successfully.',
      projectId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Database error while adding project.' });
  }
};

// Get All Projects
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id AS "projectId", name, budget, current_spend AS "currentSpend", start_date AS "startDate", end_date AS "endDate" FROM projects`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Database error while fetching projects.' });
  }
};

// Get Projects by Assigned User
export const getProjectsByAssignedUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body; // assuming the value is passed in the request body

  try {
      // Validate that userId is provided
      if (!userId) {
          res.status(400).json({ error: 'Missing required parameter: userId' });
          return;
      }

      // Query the database for projects assigned to the specified user
      const result = await pool.query(
          `SELECT id AS "projectId", name, budget, current_spend AS "currentSpend", 
                  start_date AS "startDate", end_date AS "endDate" 
           FROM projects 
           WHERE assigned_to = $1`,
          [userId]
      );

      if (result.rows.length === 0) {
          res.status(404).json({ error: `No projects found for user ID ${userId}.` });
          return;
      }

      // Return the assigned projects
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching projects for user:', error);
      res.status(500).json({ error: 'Database error while fetching projects.' });
  }
};


// Get Project Details
export const getProjectDetails = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id AS "projectId", name, budget, current_spend AS "currentSpend", start_date AS "startDate", end_date AS "endDate" 
       FROM projects WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Database error while fetching project details.' });
  }
};

// Edit Project
export const editProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, budget, startDate, endDate } = req.body;
  try {
    await pool.query(
      `UPDATE projects 
       SET name = $1, budget = $2, start_date = $3, end_date = $4, updated_at = NOW() 
       WHERE id = $5`,
      [name, budget, startDate, endDate, id]
    );
    res.status(200).json({ message: 'Project updated successfully.' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Database error while updating project.' });
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Database error while deleting project.' });
  }
};
