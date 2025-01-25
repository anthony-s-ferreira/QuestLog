import { PrismaClient } from "@prisma/client";
import { EventTypeRepository } from "./eventTypeRepository";
import { EventType } from "../domain/entities/EventType";

const prisma = new PrismaClient();

export class PrismaEventTypeRepository implements EventTypeRepository{
    create(eventType: EventType): Promise<EventType> {
        throw new Error("Method not implemented.");
    }

    getById(id: number): Promise<EventType | null> {
        throw new Error("Method not implemented.");
    }

    getAll(): Promise<EventType[]> {
        throw new Error("Method not implemented.");
    }

    update(eventType: EventType): Promise<EventType | null> {
        throw new Error("Method not implemented.");
    }

    deleteById(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}