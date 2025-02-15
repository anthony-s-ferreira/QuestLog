import { Response } from 'express';
import { EventType } from '../domain/entities/EventType';
import { EventTypeService } from '../services/EventTypeService';
import { validateId } from './CommonValidator';
import { EventTypeFormDTO } from '../domain/formDTO/EventTypeFormDTO';

const eventTypeService = new EventTypeService()

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

export const validateEventTypeDescription = (description: string) => {
    if (!description || description.trim() === "") {
        throw new Error('Event Type description is required.');
    }
    if (description.length < 20) {
        throw new Error('Event Type description must have at least 3 characters.');
    }
    if (description.length > 200) {
        throw new Error('Event Type name must have at most 200 characters.');
    }
}

export const validateEventTypeExists = async (id: number) => {
    const eventType = await eventTypeService.getEventTypeById(id);
    if (!eventType) {
        throw new Error(`Event Type with id: ${id} does not exist.`);
    }
}

export const validateEventTypeId = async (id: number, res: Response) => {
    try {
        validateId(id, 'Event Type');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    try {
        validateEventTypeExists(id);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}