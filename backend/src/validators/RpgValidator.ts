import { Response } from 'express';
import { validateId } from './CommonValidator';
import { validateUserId } from './UserValidator';
import { RPGFormDTO } from '../domain/formDTO/RpgFormDTO';
import * as repository from '../repositories/prismaRpgRepository';

/**
 * Validates the request body for creating or updating an RPG.
 * 
 * @param body - The RPG data to be validated.
 * @param res - The response object used to send error responses.
 * @throws {Error} - Throws an error if validation fails.
 */
export const validateRequestBody = async (body: RPGFormDTO, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Rpg is required.' });
        throw new Error('Rpg is required.');
    }
    try {
        validateRPGName(body.name);
        validateRPGDescription(body.description);
        if (body.active !== undefined) {
            validateRPGStatus(body.active);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    if (body.master) {
        await validateUserId(body.masterid, res);
    }
}

/**
 * Validates the RPG name.
 * 
 * @param name - The name of the RPG to be validated.
 * @throws {Error} - Throws an error if the name is invalid (too short, too long, or empty).
 */
export const validateRPGName = (name: string) => {
    if (!name || name.trim() === "") {
        throw new Error('RPG name is required.');
    }
    if (name.length < 3) {
        throw new Error('RPG name must have at least 3 characters.');
    }
    if (name.length > 20) {
        throw new Error('RPG name must have at most 20 characters.');
    }
}

/**
 * Validates the RPG description.
 * 
 * @param description - The description of the RPG to be validated.
 * @throws {Error} - Throws an error if the description is invalid (too short, too long, or empty).
 */
export const validateRPGDescription = (description: string) => {
    if (!description || description.trim() === "") {
        throw new Error('RPG description is required.');
    }
    if (description.length < 20) {
        throw new Error('RPG description must have at least 20 characters.');
    }
    if (description.length > 200) {
        throw new Error('RPG description must have at most 200 characters.');
    }
}

/**
 * Validates the RPG status.
 * 
 * @param status - The status of the RPG to be validated.
 * @throws {Error} - Throws an error if the status is invalid (not a boolean).
 */
export const validateRPGStatus = (status: boolean) => {
    if (status === undefined) {
        throw new Error('RPG status is required.');
    }

    if (typeof status !== 'boolean') {
        throw new Error('RPG status must be a boolean.');
    }
}

/**
 * Validates if an RPG exists by its ID.
 * 
 * @param id - The ID of the RPG to check.
 * @throws {Error} - Throws an error if the RPG does not exist.
 */
export const validateRPGExists = async (id: number) => {
    const rpg = await repository.getRpgById(id);
    if (!rpg) {
        throw new Error('RPG not found.');
    }
}

/**
 * Validates the RPG ID.
 * 
 * @param id - The ID of the RPG to be validated.
 * @param res - The response object used to send error responses.
 */
export const validateRPGId = async (id: number, res: Response) => {
    try {
        validateId(id, 'User');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    try {
        await validateRPGExists(id);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/**
 * Validates the RPG status for a patch request.
 * 
 * @param status - The status of the RPG to be validated.
 * @param res - The response object used to send error responses.
 */
export const validateRPGStatusPatch = (status: boolean, res: Response) => {
    try {
        validateRPGStatus(status);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}