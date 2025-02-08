import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, type } = req.body;

    try {
        const user = await userService.createUser(name, email, password, type);
        res.status(201).json(user);
    } catch (error: Error | any) {
        res.status(400).json({ message: "Erro ao criar usuário", error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: Error | any) {
        res.status(500).json({ message: "Erro ao obter usuários", error: error.message });
    }
}