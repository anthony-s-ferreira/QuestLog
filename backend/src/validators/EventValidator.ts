import { Response } from 'express';
import { validateId } from './CommonValidator';
import { validateCharacterId } from './CharacterValidator';
import { validateEventTypeId } from './EventTypeValidator';
import * as repository from '../repositories/prismaEventRepository';
import { EventFormDTO } from '../domain/formDTO/EventFormDTO';

/**
 * Validates the request body for creating or updating an event.
 * 
 * @param body - The event data to be validated.
 * @param res - The response object used to send error responses.
 * @throws {Error} - Throws an error if validation fails.
 */
export const validateRequestBody = async (body: EventFormDTO, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Event is required.' });
        throw new Error('Event is required.');
    }
    try {
        validateEventDescription(body.description);
        validateId(body.characterId, 'Character');
        validateId(body.typeId, 'Event Type');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    await validateCharacterId(body.characterId, res);
    await validateEventTypeId(body.typeId, res);
}

/**
 * Validates the event description.
 * 
 * @param description - The description of the event to be validated.
 * @throws {Error} - Throws an error if the description is invalid (too short, too long, or empty).
 */
export const validateEventDescription = (description: string) => {
    if (!description || description.trim() === "") {
        throw new Error('Event description is required.');
    }
    if (description.length < 20) {
        throw new Error('Event description must have at least 20 characters.');
    }
    if (description.length > 400) {
        throw new Error('Event description must have at most 400 characters.');
    }
}

/**
 * Validates if an event exists by its ID.
 * 
 * @param id - The ID of the event to check.
 * @throws {Error} - Throws an error if the event does not exist.
 */
export const validateEventExists = async (id: number) => {
    const event = await repository.getEvent(id);
    if (!event) {
        throw new Error('Event not found.');
    }
}

/**
 * Validates the event ID.
 * 
 * @param id - The ID of the event to be validated.
 * @param res - The response object used to send error responses.
 */
export const validateEventId = async (id: number, res: Response) => {
    try {
        validateId(id, 'Event');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    try {
        await validateEventExists(id);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}