import { Response } from 'express';
import { Character } from "../domain/entities/Character";
import { UserService } from '../services/UserService';
import { CharacterService } from '../services/CharacterService';
import { RpgService } from '../services/RpgService';

const userService = new UserService();
const characterService = new CharacterService();
const rpgService = new RpgService();

export const validateRequestBody = (body: Character, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Character data is required.' });
        throw new Error('Character data is required.');
    }
};

export const validateCharacterName = (name: string, res: Response) => {
    if (!name || name.trim() === "") {
        res.status(400).json({ message: 'Character name is required.' });
        throw new Error('Character name is required.');
    }
    if (name.length < 3) {
        res.status(400).json({ message: 'Character name must have at least 3 characters.' });
        throw new Error('Character name must have at least 3 characters.');
    }
    if (name.length > 30) {
        res.status(400).json({ message: 'Character name must have at most 30 characters.' });
        throw new Error('Character name must have at most 30 characters.');
    }
};

export const validateCharacterOwner = async (ownerId: number, res: Response) => {
    if (!ownerId) {
        res.status(400).json({ message: 'Owner ID is required.' });
        throw new Error('Owner ID is required.');
    }
    const user = await userService.getUserById(ownerId);
    if (!user) {
        res.status(404).json({ message: `User with id ${ownerId} not found.` });
        throw new Error(`User with id ${ownerId} not found.`);
    }
};

export const validateCharacterRpg = async (rpgId: number, res: Response) => {
    if (!rpgId) {
        res.status(400).json({ message: 'RPG ID is required.' });
        throw new Error('RPG ID is required.');
    }
    const rpg = await rpgService.getRPGById(rpgId);
    if (!rpg) {
        res.status(404).json({ message: `RPG with id ${rpgId} not found.` });
        throw new Error(`RPG with id ${rpgId} not found.`);
    }
};

export const validateCharacterId = async (id: number, res: Response) => {
    if (!id) {
        res.status(400).json({ message: 'Character ID is required.' });
        throw new Error('Character ID is required.');
    }
    const character = await characterService.getCharacterById(id);
    if (!character) {
        res.status(404).json({ message: `Character with id ${id} does not exist.` });
        throw new Error(`Character with id ${id} does not exist.`);
    }
};