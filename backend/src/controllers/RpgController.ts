import { Request, Response } from 'express';
import { RpgService } from "../services/RpgService";
import { validateRPGDescription, validateRPGId, validateRPGMaster, validateRPGName, validateRPGStatus } from '../validators/RpgValidator';

const rpgService = new RpgService();

export const createRPG = async (req: Request, res: Response) => {
    const { name, description, userId } = req.body;

    try {
        validateRPGName(name, res);
        validateRPGDescription(description, res);
        await validateRPGMaster(userId, res);
        const rpg = await rpgService.createRPG(name, description, userId);
        res.status(201).json(rpg);
    } catch (error: Error | any) {
        console.log('Error creating RPG:', error);
    }
};

export const getAllRPGs = async (req: Request, res: Response) => {
    try {
        const rpgs = await rpgService.getAllRPGs();
        res.status(200).json(rpgs);
    } catch (error: Error | any) {
        console.log('Error getting RPGs:', error);
    }
};

export const getRPGById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateRPGId(Number(id), res);
        const rpg = await rpgService.getRPGById(Number(id));
        res.status(200).json(rpg);
    } catch (error: Error | any) {
        console.log('Error getting RPG:', error);
    }
};

export const updateRPG = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        await validateRPGId(Number(id), res);
        validateRPGName(name, res);
        validateRPGDescription(description, res);
        const rpg = await rpgService.updateRPG(Number(id), name, description);
        res.status(200).json(rpg);
    } catch (error: Error | any) {
        console.log('Error updating RPG:', error);
    }
};

export const updateRPGStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await validateRPGId(Number(id), res);
        validateRPGStatus(status, res);
        const rpg = await rpgService.updateRPGStatus(Number(id), status);
        res.status(200).json(rpg);
    } catch (error: Error | any) {
        console.log('Error patching RPG:', error);
    }
};

export const deleteRPG = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateRPGId(Number(id), res);
        await rpgService.deleteRPG(Number(id));
        res.status(200).json({ message: "RPG deleted successfully." });
    } catch (error: Error | any) {
        console.log('Error deleting RPG:', error);
    }
};