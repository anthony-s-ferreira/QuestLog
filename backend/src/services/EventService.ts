import * as repository from '../repositories/prismaEventRepository'
import { CharacterService } from './CharacterService';
import { EventTypeService } from './EventTypeService';

const eventTypeService = new EventTypeService();
const characterService = new CharacterService();

export class EventService {
    async createEvent(description: string, eventTypeId: number, characterId: number) {
        const eventType = await eventTypeService.getEventTypeById(eventTypeId);
        const character = await characterService.getCharacterById(characterId);
        const event = {description, character: { connect: {id: character?.id}}, type: {connect: {id: eventType?.id}}};
        return await repository.createEvent(event);
    }

    async updateEvent(id: number, description: string, eventTypeId: number, characterId: number) {
        const eventType = await eventTypeService.getEventTypeById(eventTypeId);
        const character = await characterService.getCharacterById(characterId);

        const new_event = {description, character: { connect: {id: character?.id}}, type: {connect: {id: eventType?.id}}};

        return await repository.updateEvent(id, new_event);
    }

    async getEvents() {
        return await repository.getEvents();
    }

    async getEvent(id: number) {
        return await repository.getEvent(id);
    }

    async deleteEvent(id: number) {
        return await repository.deleteEvent(id);
    }
}