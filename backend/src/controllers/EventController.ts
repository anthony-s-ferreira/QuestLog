import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { validateEventId, validateRequestBody } from '../validators/EventValidator';
import { EventFormDTO } from '../domain/formDTO/EventFormDTO';
import { validatePageAndLimit } from '../validators/CommonValidator';

const eventService = new EventService();

/**
 * Creates a new event.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */ 
export const createEvent = async (req: Request, res: Response) => {
    const { description, characterId, typeId } = req.body;
    const eventForm: EventFormDTO = { description, characterId, typeId };
    try {
        await validateRequestBody(eventForm, res);
        const rpg = await eventService.createEvent(eventForm);
        res.status(201).json(rpg);
    } catch (error: Error | any) {
        console.log('Error creating Event:', error);
    }
};



/**
 * Retrieves all events with pagination.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEvents = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        validatePageAndLimit(page, limit, res);
        const events = await eventService.getEvents(page, limit);
        res.status(200).json(events);
    } catch (error: Error | any) {
        console.log('Error getting events:', error);
    }
};
/**
 * Retrieves an event by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
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

/**
 * Updates an event by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateEvent = async (req: Request, res: Response) => {
    const { description, characterId, eventTypeId } = req.body;
    const eventForm: EventFormDTO = { description, character: characterId, type: eventTypeId };
    const { id } = req.params;
    try {
        await validateEventId(Number(id), res);
        await validateRequestBody(eventForm, res);
        
        const event = await eventService.updateEvent(Number(id), eventForm);
        res.status(201).json(event);
    } catch (error: Error | any) {
        console.log('Error updating Event with id:', id, error);
    }
};

/**
 * Deletes an event by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
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