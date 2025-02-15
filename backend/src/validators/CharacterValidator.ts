import { Response } from 'express';
import { Character } from "../domain/entities/Character";
import { validateId } from './CommonValidator';
import { validateRPGId } from './RpgValidator';
import { validateUserId } from './UserValidator';
import * as repository from '../repositories/prismaCharacterRepository';
import { CharacterFormDTO } from '../domain/formDTO/CharacterFormDTO';

export const validateRequestBody = async (body: CharacterFormDTO, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Character data is required.' });
        throw new Error('Character data is required.');
    }
    try {
        validateCharacterName(body.name);
        validateId(body.ownerId, 'Owner');
        validateId(body.rpgId, 'RPG');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    await validateUserId(body.ownerId, res);
    await validateRPGId(body.rpgId, res);
};

export const validateCharacterName = (name: string) => {
    if (!name || name.trim() === "") {
        throw new Error('Character name is required.');
    }
    if (name.length < 3) {
        throw new Error('Character name must have at least 3 characters.');
    }
    if (name.length > 30) {
        throw new Error('Character name must have at most 30 characters.');
    }
};

export const validatePatchCharacterName = (name: string, res: Response) => {
    try {
        validateCharacterName(name);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }    
}

export const validateCharacterIdExists = async (id: number) => {
    const character = await repository.getCharacterById(id);
    if (!character) {
        throw new Error('Character not found.');
    }
}

export const validateCharacterExists = async (id: number) => {
    const character = await repository.getCharacterById(id);
    if (!character) {
        throw new Error('Character not found.');
    }
}

export const validateCharacterId = async (id: number, res: Response) => {
    try {
        validateId(id, 'Character');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    try {
        validateCharacterExists(id);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}