import { EventTypeDTO } from '../domain/DTO/EventTypeDTO';
import { EventType } from '../domain/entities/EventType';
import { EventTypeFormDTO } from '../domain/formDTO/EventTypeFormDTO';
import * as repository from '../repositories/prismaEventTypeRepository';
import { validateId } from '../validators/CommonValidator';
import { validateEventTypeDescription, validateEventTypeExists, validateEventTypeName } from '../validators/EventTypeValidator';

export class EventTypeService {

    /**
     * Creates a new event type.
     * 
     * @param eventTypeForm - The event type data to be created.
     * @returns The created event type.
     */
    async createEventType(eventTypeForm: EventTypeFormDTO) {
        validateEventTypeName(eventTypeForm.name);
        validateEventTypeDescription(eventTypeForm.description);
        const eventType = await repository.createEventType(eventTypeForm);
        return this.convertEventType(eventType);
    }

    /**
     * Updates an event type by ID.
     * 
     * @param id - The ID of the event type to be updated.
     * @param eventTypeForm - The event type data to be updated.
     * @returns The updated event type.
     */
    async updateEventType(id: number, eventTypeForm: EventTypeFormDTO) {
        validateId(id, 'Event Type');
        await validateEventTypeExists(id);
        validateEventTypeName(eventTypeForm.name);
        validateEventTypeDescription(eventTypeForm.description);
        const eventType = { id, name: eventTypeForm.name, description: eventTypeForm.description };
        const updatedEventType = await repository.updateEventType(id, eventType);
        return this.convertEventType(updatedEventType);
    }

    /**
     * Retrieves all event types.
     * 
     * @returns A list of all event types.
     */
    async getEventTypes() {
        const eventsType = await repository.getEventTypes();
        return eventsType.map(eventType => this.convertEventType(eventType));
    }

    /**
     * Retrieves an event type by ID.
     * 
     * @param id - The ID of the event type to be retrieved.
     * @returns The event type with the specified ID.
     */
    async getEventTypeById(id: number) {
        validateId(id, 'Event Type');
        await validateEventTypeExists(id);
        const eventType = await repository.getEventType(id);
        return this.convertEventType(eventType);
    }

    /**
     * Deletes an event type by ID.
     * 
     * @param id - The ID of the event type to be deleted.
     * @returns The result of the deletion.
     */
    async deleteEventType(id: number) {
        validateId(id, 'Event Type');
        await validateEventTypeExists(id);
        return await repository.deleteEventType(id);
    }

    /**
     * Converts an event type entity to an event type DTO.
     * 
     * @param eventType - The event type entity to be converted.
     * @returns The event type DTO.
     */
    convertEventType(eventType: EventType): EventTypeDTO {
        return { 
            id: eventType.id, 
            name: eventType.name, 
            description: eventType.description 
        };
    }
}