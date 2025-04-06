import bcrypt from 'bcrypt';
import { generateToken } from '../config/jwt';
import { UserService } from './UserService';
import { validateUserEmail, validateUserEmailExistsLogin, validateUserPassword } from '../validators/UserValidator';
import { Response } from 'express';

const userService = new UserService();

export class AuthService {
    async login(email: string, password: string, res: Response) {
        validateUserEmail(email);
        validateUserPassword(password);
        await validateUserEmailExistsLogin(email);
        const user = await userService.getUserByEmail(email);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid password.' });
            throw new Error('Invalid password.');
        }
        return generateToken(user.id);
    }
}
