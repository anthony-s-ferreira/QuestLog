import { EventDTO } from '../domain/DTO/EventDTO';
import { Event } from '../domain/entities/Event';
import { EventFormDTO } from '../domain/formDTO/EventFormDTO';
import * as repository from '../repositories/prismaEventRepository'
import { validateCharacterExists } from '../validators/CharacterValidator';
import { validateEventTypeExists } from '../validators/EventTypeValidator';
import { validateEventDescription, validateEventExists } from '../validators/EventValidator';
import { CharacterService } from './CharacterService';
import { EventTypeService } from './EventTypeService';
import { validateId } from '../validators/CommonValidator';
import { UserService } from './UserService';
import { RpgService } from './RpgService';

const eventTypeService = new EventTypeService();
const characterService = new CharacterService();
const userService = new UserService();
const rpgService = new RpgService();
export class EventService {
    async createEvent(eventForm: EventFormDTO) {
        validateEventDescription(eventForm.description);
        await validateCharacterExists(eventForm.characterId);
        await validateEventTypeExists(eventForm.typeId);
        const event = await repository.createEvent(eventForm);
        return await this.convertEvent(event);
    }

    async updateEvent(id: number, eventForm: EventFormDTO) {
        validateId(id, 'Event');
        validateId(eventForm.character, 'Character');
        validateId(eventForm.type, 'Event Type');
        await validateEventExists(id);
        await validateCharacterExists(eventForm.character);
        await validateEventTypeExists(eventForm.type);
        validateEventDescription(eventForm.description);

        const event = await repository.getEvent(id);
        const updatedEvent = {
            id: event.id,
            description: eventForm.description,
            character: eventForm.character,
            type: eventForm.type
        }

        const uEvent =  await repository.updateEvent(id, updatedEvent);

        return await this.convertEvent(uEvent);
    }

    async getEvents() {
        const events = await repository.getEvents();
        return await events.map(event => this.convertEvent(event));
    }

    async getEvent(id: number) {
        validateId(id, 'Event');
        await validateEventExists(id);
        const event = await repository.getEvent(id);
        return await this.convertEvent(event);
    }

    async deleteEvent(id: number) {
        return await repository.deleteEvent(id);
    }

    async convertEvent(event: Event): EventDTO {
        const char = await characterService.getCharacterById(event.characterId);
        const eventType = eventTypeService.convertEventType(event);
        const dto: EventDTO = {
            id: event.id,
            description: event.description,
            createdAt: event.createdAt,
            character: char,
            type: eventType
        }
        return dto;
    }
}