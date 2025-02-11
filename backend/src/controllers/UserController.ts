import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, type } = req.body;

    try {
        const user = await userService.createUser(name, email, password, type);
        res.status(201).json(user);
    } catch (error: Error | any) {
        res.status(400).json({ message: "Error creating user", error: error.message });
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
    const { id } = req.params;

    try {
        const user = await userService.getUserById(Number(id));
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error: Error | any) {
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, type } = req.body;

    try {
        const updatedUser = await userService.updateUser(Number(id), name, email, type);
        res.status(200).json(updatedUser);
    } catch (error: Error | any) {
        res.status(400).json({ message: "Error updating user", error: error.message });
    }
};

export const updateUserPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        await userService.updateUserPassword(Number(id), password);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error: Error | any) {
        res.status(400).json({ message: "Error updating password", error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await userService.getUserById(Number(id));
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await userService.deleteUser(Number(id));
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: Error | any) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};