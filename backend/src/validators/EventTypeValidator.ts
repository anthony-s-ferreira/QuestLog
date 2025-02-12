import { Response } from 'express';
import { EventType } from '../domain/entities/EventType';
import { EventTypeService } from '../services/EventTypeService';

const eventTypeService = new EventTypeService()

export const validateRequestBody = (body: EventType, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Event Type is required.' });
        throw new Error('Event Type is required.');
      }
}

export const validateEventTypeName = (name: string, res: Response) => {
    if (!name || name.trim() === "") {
        res.status(400).json({message: 'Event Type name is required.'});
        throw new Error('Event Type name is required.');
    }
    if (name.length < 3) {
        res.status(400).json({message: 'Event Type name must have at least 3 characters.'});
        throw new Error('Event Type name must have at least 3 characters.');
    }
    if (name.length > 20) {
        res.status(400).json({message: 'Event Type name must have at most 20 characters.'});
        throw new Error('Event Type name must have at most 20 characters.');
    }
}

export const validateEventTypeDescription = (description: string, res: Response) => {
    if (!description || description.trim() === "") {
        res.status(400).json({message: 'Event Type description is required.'});
        throw new Error('Event Type description is required.');
    }
    if (description.length < 20) {
        res.status(400).json({message: 'Event Type description must have at least 3 characters.'});
        throw new Error('Event Type description must have at least 3 characters.');
    }
    if (description.length > 200) {
        res.status(400).json({message: 'Event Type description must have at most 200 characters.'});
        throw new Error('Event Type name must have at most 200 characters.');
    }
}


export const validateEventTypeId = async (id: number, res: Response) => {
    if (!id) {
        res.status(400).json( { message: 'Event Type id is required.' } );
        throw new Error('Event Type id is required.');
    }
    const eventType = await eventTypeService.getEventTypeById(id);
    if (!eventType) {
        res.status(404).json( {message: `Event Type with id: ${id} does not exist.`} );
        throw new Error(`Event Type with id: ${id} does not exist.`);
    }
}