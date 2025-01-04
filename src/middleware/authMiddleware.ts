import { Request, Response, NextFunction } from 'express';

export const simpleAuth = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.headers;

  if (username === 'admin' && password === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Invalid credentials.' });
  }
};
