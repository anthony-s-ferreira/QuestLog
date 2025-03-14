import { Response } from 'express';
import { validateUserEmail, validateUserEmailExistsLogin, validateUserPassword } from "./UserValidator"

/**
 * Validates the user login data.
 * 
 * @param body - The user login data to be validated.
 * @param res - The response object used to send error responses.
 */
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
        await validateUserEmailExistsLogin(body.email);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } 
}

