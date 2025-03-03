import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  try {
    const decoded = verifyToken(token.split(' ')[1]);
    req.body.userId = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

export default authMiddleware;

