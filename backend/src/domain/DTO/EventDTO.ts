import { CharacterDTO } from "./CharacterDTO";
import { EventTypeDTO } from "./EventTypeDTO";
/**
 * Represents an event in the system.
 * 
 * @interface EventDTO
 * 
 * @property {number} id - The unique identifier of the event.
 * @property {string} description - A brief description of the event.
 * @property {Date} createdAt - The date and time when the event was created.
 * @property {CharacterDTO} character - The character associated with the event.
 * @property {EventTypeDTO} type - The type of the event.
 */

export interface EventDTO{
    id: number;
    description: string;
    createdAt: Date;
    character: CharacterDTO;
    type: EventTypeDTO;
}