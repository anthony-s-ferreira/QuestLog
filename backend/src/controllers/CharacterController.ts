import { Request, Response } from 'express';
import { CharacterService } from "../services/CharacterService";
import { validateCharacterId, validateCharacterName, validateCharacterOwner, validateCharacterRpg } from '../validators/CharacterValidator';

const characterService = new CharacterService();

export const createCharacter = async (req: Request, res: Response) => {
    const { name, ownerId, rpgId } = req.body;

    try {
        validateCharacterName(name, res);
        await validateCharacterOwner(ownerId, res);
        await validateCharacterRpg(rpgId, res);
        
        const character = await characterService.createCharacter(name, ownerId, rpgId);
        res.status(201).json(character);
    } catch (error: Error | any) {
        console.log('Error creating Character:', error);
    }
};

export const getAllCharacters = async (req: Request, res: Response) => {
    try {
        const characters = await characterService.getAllCharacters();
        res.status(200).json(characters);
    } catch (error: Error | any) {
        console.log('Error getting Characters:', error);
    }
};

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

export const updateCharacter = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, rpgId } = req.body;

    try {
        await validateCharacterId(Number(id), res);
        validateCharacterName(name, res);
        await validateCharacterRpg(rpgId, res);

        const character = await characterService.updateCharacter(Number(id), name, rpgId);
        res.status(200).json(character);
    } catch (error: Error | any) {
        console.log('Error updating Character:', error);
    }
};

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