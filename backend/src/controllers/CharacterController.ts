import { Request, Response } from 'express';
import { CharacterService } from "../services/CharacterService";
import { validateCharacterId, validatePatchCharacterName, validateRequestBody } from '../validators/CharacterValidator';
import { CharacterFormDTO } from '../domain/formDTO/CharacterFormDTO';
import { validatePage, validatePageAndLimit } from '../validators/CommonValidator';

const characterService = new CharacterService();

/**
 * Creates a new character.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createCharacter = async (req: Request, res: Response) => {
    const { name, rpgId, userId } = req.body;
    const userIdN = Number(userId);
    const charForm: CharacterFormDTO = { name, ownerId: userIdN, rpgId };
    try {
        await validateRequestBody(charForm, res);
        const character = await characterService.createCharacter(charForm);
        res.status(201).json(character);
    } catch (error: Error | any) {
        console.log('Error creating Character:', error);
    }
};

/**
 * Retrieves all characters with pagination.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllCharacters = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        validatePageAndLimit(page, limit, res);
        const characters = await characterService.getAllCharacters(page, limit);
        res.status(200).json(characters);
    } catch (error: Error | any) {
        console.log('Error getting characters:', error);
    }
};

/**
 * Retrieves all characters by user ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getCharactersByUserId = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        const characters = await characterService.getCharactersByUserId(Number(userId));
        res.status(200).json(characters);
    } catch (error: Error | any) {
        console.log('Error getting Characters:', error);
    }
};

/**
 * Retrieves a character by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getCharacterById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateCharacterId(Number(id), res);
        const character = await characterService.getCharacterById(Number(id));
        res.status(200).json(character);
    } catch (error: Error | any) {
        console.log('Error getting Character:', error);
    }
};

/**
 * Updates a character by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateCharacter = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await validateCharacterId(Number(id), res);
        validatePatchCharacterName(name, res);
        const character = await characterService.updateCharacter(Number(id), name);
        res.status(200).json(character);
    } catch (error: Error | any) {
        console.log('Error updating Character:', error);
    }
};

/**
 * Deletes a character by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteCharacter = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateCharacterId(Number(id), res);
        await characterService.deleteCharacter(Number(id));
        res.status(200).json({ message: "Character deleted successfully." });
    } catch (error: Error | any) {
        console.log('Error deleting Character:', error);
    }
};