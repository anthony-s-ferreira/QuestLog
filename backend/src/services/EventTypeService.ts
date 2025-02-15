import { EventTypeDTO } from '../domain/DTO/EventTypeDTO';
import { EventType } from '../domain/entities/EventType';
import { EventTypeFormDTO } from '../domain/formDTO/EventTypeFormDTO';
import * as repository from '../repositories/prismaEventTypeRepository'
import { validateId } from '../validators/CommonValidator';
import { validateEventTypeDescription, validateEventTypeExists, validateEventTypeName } from '../validators/EventTypeValidator';

export class EventTypeService {
    async createEventType(eventTypeForm: EventTypeFormDTO) {
        validateEventTypeName(eventTypeForm.name);
        validateEventTypeDescription(eventTypeForm.description);
        const eventType = await repository.createEventType(eventTypeForm);
        return this.convertEventType(eventType);
    }

    async updateEventType(id: number, eventTypeForm: EventTypeFormDTO) {
        validateId(id, 'Event Type');
        await validateEventTypeExists(id);
        validateEventTypeName(eventTypeForm.name);
        validateEventTypeDescription(eventTypeForm.description);
        const eventType = {id, name: eventTypeForm.name, description: eventTypeForm.description};
        const updatedEventType =  await repository.updateEventType(id, eventType);
        return this.convertEventType(updatedEventType);
    }

    async getEventTypes() {
        const eventsType = await repository.getEventTypes();
        return eventsType.map(eventType => this.convertEventType(eventType));
    }

    async getEventTypeById(id: number) {
        validateId(id, 'Event Type');
        await validateEventTypeExists(id);
        const eventType = await repository.getEventType(id);
        return this.convertEventType(eventType);
    }

    async deleteEventType(id: number) {
        validateId(id, 'Event Type');
        await validateEventTypeExists(id);
        return await repository.deleteEventType(id);
    }

    convertEventType(eventType: EventType) : EventTypeDTO {
        return { 
            id: eventType.id, 
            name: eventType.name, 
            description: eventType.description };
    }
}