import { Request, Response } from 'express';
import pool from '../config/db';

// Add Worker
export const addWorker = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, password, role]
    );
    res.status(201).json({
      message: 'Worker created successfully.',
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while adding worker.' });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const userResult = await pool.query(
      `SELECT id, password FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const { id, password: storedPassword } = userResult.rows[0];

    // Compare plain-text password
    if (password !== storedPassword) {
      res.status(401).json({ error: 'Invalid password.' });
      return;
    }

    // Return user ID
    res.status(200).json({ message: 'Login successful.', userId: id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Database error during login.' });
  }
};

// Get All Workers
export const getAllWorkers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id AS "userId", name, email, assigned_projects AS "assignedProjects" 
       FROM users WHERE role = 'Worker'`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while fetching workers.' });
  }
};

// Edit Worker
export const editWorker = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, assignedProjects } = req.body;
  try {
    await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, password = $3, assigned_projects = $4, updated_at = NOW() 
       WHERE id = $5`,
      [name, email, password, assignedProjects, id]
    );
    res.status(200).json({ message: 'Worker updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while updating worker.' });
  }
};

// Delete Worker
export const deleteWorker = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Worker deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while deleting worker.' });
  }
};
