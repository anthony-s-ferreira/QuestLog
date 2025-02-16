import { Character } from "./Character";
import { EventType } from "./EventType";
/**
 * Represents an event in the system.
 * 
 * @interface Event
 * 
 * @property {number} id - The unique identifier for the event.
 * @property {string} description - A brief description of the event.
 * @property {Date} [createdAt] - The date and time when the event was created. This property is optional.
 * @property {Character} character - The character associated with the event.
 * @property {EventType} type - The type of the event.
 */

export interface Event{
    id: number;
    description: string;
    createdAt?: Date;
    character: Character;
    type: EventType;
}