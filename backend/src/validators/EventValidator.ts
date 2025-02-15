import { Response } from 'express';
import { Event } from '../domain/entities/Event';
import { validateId } from './CommonValidator';
import { validateCharacterId } from './CharacterValidator';
import { validateEventTypeId } from './EventTypeValidator';
import * as repository from '../repositories/prismaEventRepository';
import { EventFormDTO } from '../domain/formDTO/EventFormDTO';

export const validateRequestBody = async (body: EventFormDTO, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Event is required.' });
        throw new Error('Event is required.');
      }
    try {
        validateEventDescription(body.description);
        validateId(body.characterId, 'Character');
        validateId(body.typeId, 'Event Type');
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
    await validateCharacterId(body.characterId, res);
    await validateEventTypeId(body.typeId, res);

}

export const validateEventDescription = (description: string) => {
    if (!description || description.trim() === "") {
        throw new Error('Event description is required.');
    }
    if (description.length < 20) {
        throw new Error('Event description must have at least 3 characters.');
    }
    if (description.length > 400) {
        throw new Error('Event name must have at most 400 characters.');
    }
}

export const validateEventExists = async (id: number) => {
    const event = await repository.getEvent(id);
    if (!event) {
        throw new Error('Event not found.');
    }
}

export const validateEventId = async (id: number, res: Response) => {
    try {
        validateId(id, 'Event');
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
    try {
        validateEventExists(id);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}