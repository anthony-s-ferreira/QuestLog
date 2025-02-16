import { Response } from 'express';
import { EventType } from '../domain/entities/EventType';
import { validateId } from './CommonValidator';
import { EventTypeFormDTO } from '../domain/formDTO/EventTypeFormDTO';
import * as repository from '../repositories/prismaEventTypeRepository';

/**
 * Validates the request body for creating or updating an event type.
 * 
 * @param body - The event type data to be validated.
 * @param res - The response object used to send error responses.
 * @throws {Error} - Throws an error if validation fails.
 */
export const validateRequestBody = (body: EventTypeFormDTO, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Event Type is required.' });
        throw new Error('Event Type is required.');
    }
    try {
        validateEventTypeName(body.name);
        validateEventTypeDescription(body.description);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Validates the event type name.
 * 
 * @param name - The name of the event type to be validated.
 * @throws {Error} - Throws an error if the name is invalid (too short, too long, or empty).
 */
export const validateEventTypeName = (name: string) => {
    if (!name || name.trim() === "") {
        throw new Error('Event Type name is required.');
    }
    if (name.length < 3) {
        throw new Error('Event Type name must have at least 3 characters.');
    }
    if (name.length > 20) {
        throw new Error('Event Type name must have at most 20 characters.');
    }
}

/**
 * Validates the event type description.
 * 
 * @param description - The description of the event type to be validated.
 * @throws {Error} - Throws an error if the description is invalid (too short, too long, or empty).
 */
export const validateEventTypeDescription = (description: string) => {
    if (!description || description.trim() === "") {
        throw new Error('Event Type description is required.');
    }
    if (description.length < 20) {
        throw new Error('Event Type description must have at least 20 characters.');
    }
    if (description.length > 200) {
        throw new Error('Event Type description must have at most 200 characters.');
    }
}

/**
 * Validates if an event type exists by its ID.
 * 
 * @param id - The ID of the event type to check.
 * @throws {Error} - Throws an error if the event type does not exist.
 */
export const validateEventTypeExists = async (id: number) => {
    const eventType = await repository.getEventType(id);
    if (!eventType) {
        throw new Error(`Event Type with id: ${id} does not exist.`);
    }
}

/**
 * Validates the event type ID.
 * 
 * @param id - The ID of the event type to be validated.
 * @param res - The response object used to send error responses.
 */
export const validateEventTypeId = async (id: number, res: Response) => {
    try {
        validateId(id, 'Event Type');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    try {
        await validateEventTypeExists(id);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}