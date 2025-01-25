import { EventType } from "../domain/entities/EventType";

export interface EventTypeRepository {
    create(eventType: EventType): Promise<EventType>;
    getById(id: number): Promise<EventType | null>;
    getAll(): Promise<EventType[]>;
    update(eventType: EventType): Promise<EventType | null>;
    deleteById(id: number): Promise<boolean>;
}