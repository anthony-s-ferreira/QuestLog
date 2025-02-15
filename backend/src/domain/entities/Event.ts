import { Character } from "./Character";
import { EventType } from "./EventType";

export interface Event{
    id: number;
    description: string;
    createdAt?: Date;
    character: Character;
    type: EventType;
}