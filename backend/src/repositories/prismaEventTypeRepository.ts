import { db } from "../../config/database";

/**
 * Creates a new event type.
 * 
 * @param input - The event type data to be created.
 * @returns The created event type.
 */
export const createEventType = (input: any) => {
    return db.eventType.create({
        data: input,
    });
};

/**
 * Updates an event type by ID.
 * 
 * @param id - The ID of the event type to be updated.
 * @param input - The event type data to be updated.
 * @returns The updated event type.
 */
export const updateEventType = (id: number, input: any) => {
    return db.eventType.update({
        data: input, where: { id }
    });
};

/**
 * Retrieves all event types.
 * 
 * @returns A list of all event types.
 */
export const getEventTypes = () => {
    return db.eventType.findMany();
}

/**
 * Retrieves an event type by ID.
 * 
 * @param id - The ID of the event type to be retrieved.
 * @returns The event type with the specified ID.
 */
export const getEventType = (id: number) => {
    return db.eventType.findUnique({ where: { id } });
}

/**
 * Deletes an event type by ID.
 * 
 * @param id - The ID of the event type to be deleted.
 * @returns The result of the deletion.
 */
export const deleteEventType = (id: number) => {
    return db.eventType.delete({ where: { id } });
}