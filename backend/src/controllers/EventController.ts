import { Request, Response } from 'express';
import { validateEventTypeId  } from '../validators/EventTypeValidator';
import { validateCharacterId } from '../validators/CharacterValidator';
import { EventService } from '../services/EventService';
import { validateEventDescription, validateEventId, validateRequestBody } from '../validators/EventValidator';

const eventService = new EventService()

export const createEvent = async (req: Request, res: Response) => {
    const { description, characterId, typeId } = req.body;

    try {
        validateRequestBody(req.body, res);
        validateEventDescription(description, res);
        await validateCharacterId(characterId, res)
        await validateEventTypeId(typeId, res)
        const rpg = await eventService.createEvent(description, typeId, characterId);
        res.status(201).json(rpg);
    } catch (error: Error | any) {
        console.log('Error creating Event:', error);
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getEvents();
        res.status(200).json(events);
    } catch (error: Error | any) {
        console.log('Error retrieving Events:', error);
    }
};

export const getEventById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateEventId(Number(id), res);
        const event = await eventService.getEvent(Number(id));
        res.status(200).json(event);
    } catch (error: Error | any) {
        console.log('Error retrieving Event with id :', id, error);
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    const { description, characterId, eventTypeId } = req.body;
    const { id } = req.params;
    try {
        await validateEventId(Number(id), res);
        await validateCharacterId(Number(id), res);
        await validateEventTypeId(eventTypeId, res)
        validateEventDescription(description, res);
        
        const event = await eventService.updateEvent(Number(id), description, eventTypeId, characterId);
        res.status(201).json(event);
    } catch (error: Error | any) {
        console.log('Error updating Event with id:', id, error);
    }
};

export const deleteEventById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateEventId(Number(id), res);
        const event = await eventService.deleteEvent(Number(id));
        res.status(200).json(event);
    } catch (error: Error | any) {
        console.log('Error deleting Event with id:', id, error);
    }
};