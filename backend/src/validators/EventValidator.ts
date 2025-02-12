import { Response } from 'express';
import { Event } from '../domain/entities/Event';
import { EventService } from '../services/EventService';
import { CharacterService } from '../services/CharacterService';
import { EventTypeService } from '../services/EventTypeService';

const eventService = new EventService();

export const validateRequestBody = (body: Event, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Event is required.' });
        throw new Error('Event is required.');
      }
}

export const validateEventDescription = (description: string, res: Response) => {
    if (!description || description.trim() === "") {
        res.status(400).json({message: 'Event description is required.'});
        throw new Error('Event description is required.');
    }
    if (description.length < 20) {
        res.status(400).json({message: 'Event description must have at least 3 characters.'});
        throw new Error('Event description must have at least 3 characters.');
    }
    if (description.length > 400) {
        res.status(400).json({message: 'Event description must have at most 400 characters.'});
        throw new Error('Event name must have at most 400 characters.');
    }
}

export const validateEventId = async (id: number, res: Response) => {
    if (!id) {
        res.status(400).json( { message: 'Event id is required.' } );
        throw new Error('Event id is required.');
    }
    const Event = await eventService.getEvent(id);
    if (!Event) {
        res.status(404).json( {message: `Event with id: ${id} does not exist.`} );
        throw new Error(`Event with id: ${id} does not exist.`);
    }
}