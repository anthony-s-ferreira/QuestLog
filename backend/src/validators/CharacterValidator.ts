import { Response } from 'express';
import { validateId } from './CommonValidator';
import { validateRPGId } from './RpgValidator';
import { validateUserId } from './UserValidator';
import * as repository from '../repositories/prismaCharacterRepository';
import { CharacterFormDTO } from '../domain/formDTO/CharacterFormDTO';

/**
 * Validates the request body for creating or updating a character.
 * 
 * @param body - The character data to be validated.
 * @param res - The response object used to send error responses.
 * @throws {Error} - Throws an error if validation fails.
 */
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

/**
 * Validates the character name.
 * 
 * @param name - The name of the character to be validated.
 * @throws {Error} - Throws an error if the name is invalid (too short, too long, or empty).
 */
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

/**
 * Validates the character name for a patch request.
 * 
 * @param name - The name of the character to be validated.
 * @param res - The response object used to send error responses.
 */
export const validatePatchCharacterName = (name: string, res: Response) => {
    try {
        validateCharacterName(name);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }    
}

/**
 * Validates if a character exists by its ID.
 * 
 * @param id - The ID of the character to check.
 * @throws {Error} - Throws an error if the character does not exist.
 */
export const validateCharacterIdExists = async (id: number) => {
    const character = await repository.getCharacterById(id);
    if (!character) {
        throw new Error('Character not found.');
    }
}

/**
 * Validates if a character exists by its ID.
 * 
 * @param id - The ID of the character to check.
 * @throws {Error} - Throws an error if the character does not exist.
 */
export const validateCharacterExists = async (id: number) => {
    const character = await repository.getCharacterById(id);
    if (!character) {
        throw new Error('Character not found.');
    }
}

/**
 * Validates the character ID.
 * 
 * @param id - The ID of the character to be validated.
 * @param res - The response object used to send error responses.
 */
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