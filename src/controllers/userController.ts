import { Request, Response } from 'express';
import pool from '../config/db';

export const addUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = /* use bcrypt to hash the password */;
    const result = await pool.query(
      'INSERT INTO users (name, email, passwordHash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'User created successfully.', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Database error.' });
  }
};

export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE role = $1', ['Worker']);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error.' });
  }
};
