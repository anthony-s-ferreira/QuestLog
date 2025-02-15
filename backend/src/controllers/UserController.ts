import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { validateRequestBody, validateUserId, validateUserPasswordUpdate } from '../validators/UserValidator';
import { UserFormDTO } from '../domain/formDTO/UserFormDTO';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, type } = req.body;
    const userForm: UserFormDTO= {name, email, password, type};
    try {
        validateRequestBody(userForm, res);
        const user = await userService.createUser(name, email, password, type);
        res.status(201).json(user);
    } catch (error: Error | any) {
        console.log({ message: "Error creating user", error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: Error | any) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    let { id } = req.params;
    try {
        await validateUserId(Number(id), res);
        const user = await userService.getUserById(Number(id));
        res.status(200).json(user);
    } catch (error: Error | any) {
        console.log({ message: "Error retrieving user", error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, type, password } = req.body;
    const userForm: UserFormDTO= {name, email, password, type};

    try {
        await validateUserId(Number(id), res);
        validateRequestBody(userForm, res);
        const updatedUser = await userService.updateUser(Number(id), name, email, type);
        res.status(200).json(updatedUser);
    } catch (error: Error | any) {
        console.log({ message: "Error updating user", error: error.message });
    }
};

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