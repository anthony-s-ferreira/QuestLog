import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../domain/entities/User';

const SECRET_KEY = process.env.SECRET_KEY

interface CustomRequest extends Request {
    user?: User;

}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user as User;
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized:' + error);
    }
}