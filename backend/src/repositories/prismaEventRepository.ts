import { db } from "../../config/database";

/**
 * Creates a new event.
 * 
 * @param input - The event data to be created.
 * @returns The created event.
 */
export const createEvent = (input: any) => {
    return db.event.create({
        data: input,
        include: {
            character: true,
            type: true
        }
    });
};

/**
 * Updates an event by ID.
 * 
 * @param id - The ID of the event to be updated.
 * @param input - The event data to be updated.
 * @returns The updated event.
 */
export const updateEvent = (id: number, input: any) => {
    return db.event.update({
        data: input, 
        where: { id },
        include: {
            character: true,
            type: true
        },
    });
};

/**
 * Retrieves all events.
 * 
 * @returns A list of all events.
 */
export const getEvents = () => {
    return db.event.findMany({
        include: {
            character: true,
            type: true
        },
    });
}

/**
 * Retrieves an event by ID.
 * 
 * @param id - The ID of the event to be retrieved.
 * @returns The event with the specified ID.
 */
export const getEvent = (id: number) => {
    return db.event.findUnique({
        where: { id },
        include: {
            character: true,
            type: true
        },
    });
}

/**
 * Deletes an event by ID.
 * 
 * @param id - The ID of the event to be deleted.
 * @returns The result of the deletion.
 */
export const deleteEvent = (id: number) => {
    return db.event.delete({ where: { id } });
}