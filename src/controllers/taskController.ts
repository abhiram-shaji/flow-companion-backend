import { Request, Response } from 'express';
import pool from '../config/db';

// Add Task
export const addTask = async (req: Request, res: Response): Promise<void> => {
    const { projectId, taskName, assignedTo, dueDate, status } = req.body;
    try {
      // Validate projectId
      const projectResult = await pool.query(`SELECT id FROM projects WHERE id = $1`, [projectId]);
      if (projectResult.rows.length === 0) {
        res.status(400).json({ error: `Project with ID ${projectId} does not exist.` });
        return;
      }
  
      // Validate assignedTo
      const userResult = await pool.query(`SELECT id FROM users WHERE id = $1`, [assignedTo]);
      if (userResult.rows.length === 0) {
        res.status(400).json({ error: `User with ID ${assignedTo} does not exist.` });
        return;
      }
  
      // Insert task
      const result = await pool.query(
        `INSERT INTO tasks (project_id, name, assigned_to, due_date, status) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [projectId, taskName, assignedTo, dueDate, status || 'Pending']
      );
      res.status(201).json({
        message: 'Task created successfully.',
        taskId: result.rows[0].id,
      });
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Database error while adding task.' });
    }
  };
  
// Get Tasks by Project
export const getTasksByProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id AS "taskId", name AS "taskName", assigned_to AS "assignedTo", due_date AS "dueDate", status 
       FROM tasks WHERE project_id = $1`,
      [projectId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Database error while fetching tasks.' });
  }
};

// Get Tasks by Assigned User
export const getTasksByAssignedTo = async (req: Request, res: Response): Promise<void> => {
  const { assignedTo } = req.body; // assuming the value is passed in the request body

  try {
      // Validate that assignedTo is provided
      if (!assignedTo) {
          res.status(400).json({ error: 'Missing required parameter: assignedTo' });
          return;
      }

      // Query the database for tasks assigned to the specified user
      const result = await pool.query(
          `SELECT id AS "taskId", project_id AS "projectId", name AS "taskName", 
                  assigned_to AS "assignedTo", due_date AS "dueDate", status 
           FROM tasks WHERE assigned_to = $1`,
          [assignedTo]
      );

      // Return the tasks
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching tasks by assigned user:', error);
      res.status(500).json({ error: 'Database error while fetching tasks.' });
  }
};

// Get All Tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
      // Query the database to get all tasks
      const result = await pool.query(
          `SELECT id AS "taskId", project_id AS "projectId", name AS "taskName", 
                  assigned_to AS "assignedTo", due_date AS "dueDate", status 
           FROM tasks`
      );

      // Return the tasks
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching all tasks:', error);
      res.status(500).json({ error: 'Database error while fetching tasks.' });
  }
}

// Edit Task
export const editTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { taskName, assignedTo, dueDate, status } = req.body;
  try {
    await pool.query(
      `UPDATE tasks 
       SET name = $1, assigned_to = $2, due_date = $3, status = $4, updated_at = NOW() 
       WHERE id = $5`,
      [taskName, assignedTo, dueDate, status, id]
    );
    res.status(200).json({ message: 'Task updated successfully.' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Database error while updating task.' });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Database error while deleting task.' });
  }
};
