import { Response } from 'express';
import { validateUserEmail, validateUserEmailExists, validateUserPassword } from "./UserValidator"

export const validateUserLoginBody = async (body: any, res: Response) => {
    if (Object.keys(body).length === 0 || !body.email.trim() || !body.password.trim()) {
        res.status(400).json({ message: 'User login data is required.' });
        throw new Error('User login data is required.');
    }

    try{
        validateUserEmail(body.email);
        validateUserPassword(body.password);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

    try {
        await validateUserEmailExists(body.email);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } 
}

