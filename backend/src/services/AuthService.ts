import bcrypt from 'bcrypt';
import { generateToken } from '../config/jwt';
import { UserService } from './UserService';
import { validateUserEmail, validateUserEmailExists, validateUserPassword } from '../validators/UserValidator';

const userService = new UserService();

export class AuthService {
    async login(email: string, password: string) {
        validateUserEmail(email);
        validateUserPassword(password);
        await validateUserEmailExists(email);
        const user = await userService.getUserByEmail(email);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid password.');
        }
        return generateToken(user.id);
    }
}
