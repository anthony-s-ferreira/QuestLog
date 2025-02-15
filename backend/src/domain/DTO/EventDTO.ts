import { CharacterDTO } from "./CharacterDTO";
import { EventTypeDTO } from "./EventTypeDTO";

export interface EventDTO{
    id: number;
    description: string;
    createdAt: Date;
    character: CharacterDTO;
    type: EventTypeDTO;
}