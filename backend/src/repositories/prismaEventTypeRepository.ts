import { db } from "../../config/database";

export const createEventType = (input: any) => {
    return db.eventType.create({
        data: input,
    });
};

export const updateEventType = (id: number, input: any) => {
    return db.eventType.update({
        data: input, where: {id}
    });
};

export const getEventTypes = () => {
    return db.eventType.findMany();
}

export const getEventType = (id: number) => {
    return db.eventType.findUnique({where: {id}})
}

export const deleteEventType = (id: number) => {
    return db.eventType.delete({where: {id}})
}