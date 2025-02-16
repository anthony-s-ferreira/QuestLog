import { Request, Response } from 'express';
import { validateEventTypeId, validateRequestBody } from '../validators/EventTypeValidator';
import { EventTypeService } from '../services/EventTypeService';
import { EventTypeFormDTO } from '../domain/formDTO/EventTypeFormDTO';

const eventTypeService = new EventTypeService();

/**
 * Creates a new event type.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createEventType = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const eventTypeForm: EventTypeFormDTO = { name, description };
    try {
        validateRequestBody(eventTypeForm, res);
        const eventType = await eventTypeService.createEventType(eventTypeForm);
        res.status(201).json(eventType);
    } catch (error: Error | any) {
        console.log('Error creating Event Type:', error);
    }
};

/**
 * Retrieves all event types.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEventTypes = async (req: Request, res: Response) => {
    try {
        const eventTypes = await eventTypeService.getEventTypes();
        res.status(200).json(eventTypes);
    } catch (error: Error | any) {
        console.log('Error retrieving Event Types:', error);
    }
};

/**
 * Retrieves an event type by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEventTypeById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateEventTypeId(Number(id), res);
        const eventTypes = await eventTypeService.getEventTypeById(Number(id));
        res.status(200).json(eventTypes);
    } catch (error: Error | any) {
        console.log('Error retrieving Event type with id :', id, error);
    }
};

/**
 * Updates an event type by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateEventType = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const { id } = req.params;
    const eventTypeForm: EventTypeFormDTO = { name, description };
    try {
        validateRequestBody(eventTypeForm, res);
        await validateEventTypeId(Number(id), res);
        const eventType = await eventTypeService.updateEventType(Number(id), eventTypeForm);
        res.status(201).json(eventType);
    } catch (error: Error | any) {
        console.log('Error updating Event type with id:', id, error);
    }
};

/**
 * Deletes an event type by ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteEventTypeById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await validateEventTypeId(Number(id), res);
        const eventTypes = await eventTypeService.deleteEventType(Number(id));
        res.status(200).json(eventTypes);
    } catch (error: Error | any) {
        console.log('Error deleting Event type with id:', id, error);
    }
};