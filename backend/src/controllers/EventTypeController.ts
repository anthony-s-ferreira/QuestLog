import { Request, Response } from 'express';
import { validateEventTypeDescription, validateEventTypeId, validateEventTypeName, validateRequestBody } from '../validators/EventTypeValidator';
import { EventTypeService } from '../services/EventTypeService';

const eventTypeService = new EventTypeService()

export const createEventType = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    try {
        validateRequestBody(req.body, res)
        validateEventTypeName(name, res);
        validateEventTypeDescription(description, res);
        const rpg = await eventTypeService.createEventType(name, description);
        res.status(201).json(rpg);
    } catch (error: Error | any) {
        console.log('Error creating Event Type:', error);
    }
};

export const getEventTypes = async (req: Request, res: Response) => {
    try {
        const eventTypes = await eventTypeService.getEventTypes();
        res.status(200).json(eventTypes);
    } catch (error: Error | any) {
        console.log('Error retrieving Event Types:', error);
    }
};

export const getEventTypeById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        console.log(id)
        await validateEventTypeId(Number(id), res);
        const eventTypes = await eventTypeService.getEventTypeById(Number(id));
        res.status(200).json(eventTypes);
    } catch (error: Error | any) {
        console.log('Error retrieving Event type with id :', id, error);
    }
};

export const updateEventType = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const { id } = req.params;
    try {
        await validateEventTypeId(Number(id), res);
        validateEventTypeName(name, res);
        validateEventTypeDescription(description, res);
        const rpg = await eventTypeService.updateEventType(Number(id), name, description);
        res.status(201).json(rpg);
    } catch (error: Error | any) {
        console.log('Error updating Event type with id:', id, error);
    }
};

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