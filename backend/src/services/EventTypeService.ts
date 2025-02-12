import * as repository from '../repositories/prismaEventTypeRepository'

export class EventTypeService {
    async createEventType(name: string, description: string) {
        const eventType = {name, description};
        return await repository.createEventType(eventType);
    }

    async updateEventType(id: number, name: string, description: string) {
        const eventType = {id, name, description};
        return await repository.updateEventType(id, eventType);
    }

    async getEventTypes() {
        return await repository.getEventTypes();
    }

    async getEventTypeById(id: number) {
        return await repository.getEventType(id);
    }

    async deleteEventType(id: number) {
        return await repository.deleteEventType(id);
    }
}