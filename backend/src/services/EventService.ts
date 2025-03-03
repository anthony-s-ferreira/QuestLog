import { EventDTO } from '../domain/DTO/EventDTO';
import { Event } from '../domain/entities/Event';
import { EventFormDTO } from '../domain/formDTO/EventFormDTO';
import * as repository from '../repositories/prismaEventRepository';
import { validateCharacterExists } from '../validators/CharacterValidator';
import { validateEventTypeExists } from '../validators/EventTypeValidator';
import { validateEventDescription, validateEventExists } from '../validators/EventValidator';
import { CharacterService } from './CharacterService';
import { EventTypeService } from './EventTypeService';
import { validateId } from '../validators/CommonValidator';
import { validateRPGExists } from '../validators/RpgValidator';

const eventTypeService = new EventTypeService();
const characterService = new CharacterService();

export class EventService {

    /**
     *  Retrieves all events for an RPG by ID.
     *  
     * @param rpgId - The ID of the RPG to retrieve events for.
     * @returns A list of all events for the RPG with the specified ID.
     */
    async getEventsByRPGId(rpgId: number) {
        validateId(rpgId, 'RPG');
        await validateRPGExists(rpgId);
        const events = await repository.getEventsByRPGId(rpgId);
        return await events.map(event => this.convertEvent(event));
    }

    /**
     * Creates a new event.
     * 
     * @param eventForm - The event data to be created.
     * @returns The created event.
     */
    async createEvent(eventForm: EventFormDTO) {
        validateEventDescription(eventForm.description);
        await validateCharacterExists(eventForm.characterId);
        await validateEventTypeExists(eventForm.typeId);
        const event = await repository.createEvent(eventForm);
        return await this.convertEvent(event);
    }

    /**
     * Updates an event by ID.
     * 
     * @param id - The ID of the event to be updated.
     * @param eventForm - The event data to be updated.
     * @returns The updated event.
     */
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
        };

        const uEvent = await repository.updateEvent(id, updatedEvent);

        return await this.convertEvent(uEvent);
    }

    /**
     * Retrieves all events.
     * 
     * @returns A list of all events.
     */
    async getEvents() {
        const events = await repository.getEvents();
        return await events.map(event => this.convertEvent(event));
    }

    /**
     * Retrieves an event by ID.
     * 
     * @param id - The ID of the event to be retrieved.
     * @returns The event with the specified ID.
     */
    async getEvent(id: number) {
        validateId(id, 'Event');
        await validateEventExists(id);
        const event = await repository.getEvent(id);
        return await this.convertEvent(event);
    }

    /**
     * Deletes an event by ID.
     * 
     * @param id - The ID of the event to be deleted.
     * @returns The result of the deletion.
     */
    async deleteEvent(id: number) {
        return await repository.deleteEvent(id);
    }

    /**
     * Converts an event entity to an event DTO.
     * 
     * @param event - The event entity to be converted.
     * @returns The event DTO.
     */
    async convertEvent(event: Event): EventDTO {
        const char = await characterService.getCharacterById(event.characterId);
        const eventType = eventTypeService.convertEventType(event);
        const dto: EventDTO = {
            id: event.id,
            description: event.description,
            createdAt: event.createdAt,
            character: char,
            type: eventType
        };
        return dto;
    }
}