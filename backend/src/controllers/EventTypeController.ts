import { Request, Response } from 'express';
import { validateEventTypeDescription, validateEventTypeId, validateEventTypeName, validateRequestBody } from '../validators/EventTypeValidator';
import { EventTypeService } from '../services/EventTypeService';
import { EventTypeFormDTO } from '../domain/formDTO/EventTypeFormDTO';

const eventTypeService = new EventTypeService()

export const createEventType = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const eventTypeForm: EventTypeFormDTO = {name, description}
    try {
        validateRequestBody(eventTypeForm, res);
        const eventType = await eventTypeService.createEventType(eventTypeForm);
        res.status(201).json(eventType);
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
    const eventTypeForm: EventTypeFormDTO = {name, description}
    try {
        validateRequestBody(eventTypeForm, res);
        await validateEventTypeId(Number(id), res);
        const eventType = await eventTypeService.updateEventType(Number(id), eventTypeForm);
        res.status(201).json(eventType);
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