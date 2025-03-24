import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { validateRequestBody, validateUserId, validateUserPasswordUpdate } from '../validators/UserValidator';
import { UserFormDTO } from '../domain/formDTO/UserFormDTO';
import { validateUserLoginBody } from '../validators/AuthValidator';
import { AuthService } from '../services/AuthService';
import { validatePageAndLimit } from '../validators/CommonValidator';

const userService = new UserService();
const authService = new AuthService();
/**
 * Creates a new user.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, type } = req.body;
    const userForm: UserFormDTO = { name, email, password, type };
    try {
        validateRequestBody(userForm, res);
        const user = await userService.createUser(userForm);
        res.status(201).json(user);
    } catch (error: Error | any) {
        console.log({ message: "Error creating user", error: error.message });
    }
};

/**
 * Logs in a user.
 * @param req - Express request object
 * @param res - Express response object
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        validateUserLoginBody(req.body, res);
        const token = await authService.login(email, password);
        res.status(200).json({ token });
    } catch (error: Error | any) {
        console.log({ message: "Error logging in", error: error.message });
    }
};

/**
 * Retrieves all users with pagination.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        validatePageAndLimit(page, limit, res);
        const users = await userService.getAllUsers(page, limit);
        res.status(200).json(users);
    } catch (error: Error | any) {
        console.log('Error getting users:', error);
    }
};

/**
 * Retrieves a user by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await validateUserId(Number(id), res);
        const user = await userService.getUserById(Number(id));
        res.status(200).json(user);
    } catch (error: Error | any) {
        console.log({ message: "Error retrieving user", error: error.message });
    }
};

/**
 * Updates a user by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, type, password } = req.body;
    const userForm: UserFormDTO = { name, email, password: 'u', type };
    try {
        await validateUserId(Number(id), res);
        validateRequestBody(userForm, res);
        const updatedUser = await userService.updateUser(Number(id), userForm);
        res.status(200).json(updatedUser);
    } catch (error: Error | any) {
        console.log({ message: "Error updating user", error: error.message });
    }
};

/**
 * Updates a user's password by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateUserPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password, newPassword } = req.body;

    try {
        await validateUserId(Number(id), res);
        await validateUserPasswordUpdate(Number(id), password, newPassword, res);
        await userService.updateUserPassword(Number(id), newPassword);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error: Error | any) {
        console.log({ message: "Error updating password", error: error.message });
    }
};

/**
 * Deletes a user by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateUserId(Number(id), res);
        await userService.deleteUser(Number(id));
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: Error | any) {
        console.log({ message: "Error deleting user", error: error.message });
    }
};

/**
 * Retrieves the user's profile.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getProfile = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        validateUserId(Number(userId), res);
        const user = await userService.getUserById(Number(userId));
        res.status(200).json(user);
    } catch (error: Error | any) {
        console.log({ message: "Error getting profile", error: error.message });
    }
};

