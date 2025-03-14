import { Request, Response } from 'express';
import { RpgService } from "../services/RpgService";
import { validateRequestBody, validateRPGId, validateRPGStatusPatch } from '../validators/RpgValidator';
import { RPGFormDTO } from '../domain/formDTO/RpgFormDTO';
import { EventService } from '../services/EventService';
import { validatePageAndLimit } from '../validators/CommonValidator';

const rpgService = new RpgService();
const eventService = new EventService();

/**
 * Creates a new RPG.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createRPG = async (req: Request, res: Response) => {
    const { name, description, userId } = req.body;
    const rpgFormDTO: RPGFormDTO = {name, description, masterid: Number(userId), active: true}; 
    try {
        await validateRequestBody(rpgFormDTO, res);
        const rpg = await rpgService.createRPG(rpgFormDTO);
        res.status(201).json(rpg);
    } catch (error: Error | any) {
        console.log('Error creating RPG:', error);
    }
};

/**
 * Retrieves all RPGs.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllRPGs = async (req: Request, res: Response) => {
    try {
        const rpgs = await rpgService.getAllRPGs();
        res.status(200).json(rpgs);
    } catch (error: Error | any) {
        console.log('Error getting RPGs:', error);
    }
};

/**
 * Retrieves all RPGs by user ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getRPGsByUserId = async (req: Request, res: Response) => {
    const { userId } = req.body.userId;
    try {
        const rpgs = await rpgService.getRPGByUserId(Number(userId));
        res.status(200).json(rpgs);
    } catch (error: Error | any) {
        console.log('Error getting RPGs:', error);
    }
};

/**
 * Retrieves all events for an RPG by ID with pagination.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getRPGEvents = async (req: Request, res: Response) => {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        await validateRPGId(Number(id), res);
        validatePageAndLimit(page, limit, res);
        const events = await eventService.getEventsByRPGId(Number(id), page, limit);
        if (!events) {
            return res.status(404).json({ message: "RPG not found." });
        }
        return res.status(200).json(events);
    } catch (error: Error | any) {
        console.log('Error getting RPG events:', error);
    }
};

/**
 * Retrieves an RPG by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
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

/**
 * Updates an RPG by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateRPG = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const rpgFormDTO: RPGFormDTO = {name, description}; 
    try {
        await validateRPGId(Number(id), res);
        validateRequestBody(rpgFormDTO, res);
        const rpg = await rpgService.updateRPG(Number(id), rpgFormDTO);
        res.status(200).json(rpg);
    } catch (error: Error | any) {
        console.log('Error updating RPG:', error);
    }
};

/**
 * Updates the status of an RPG by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateRPGStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await validateRPGId(Number(id), res);
        validateRPGStatusPatch(status, res);
        const rpg = await rpgService.updateRPGStatus(Number(id), status);
        res.status(200).json(rpg);
    } catch (error: Error | any) {
        console.log('Error patching RPG:', error);
    }
};

/**
 * Deletes an RPG by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
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