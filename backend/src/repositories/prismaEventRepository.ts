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
 * Retrieves all events with pagination.
 * 
 * @param page - The page number.
 * @param limit - The number of events per page.
 * @returns A list of events.
 */
export const getEvents = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return db.event.findMany({
        skip: offset,
        take: limit,
        include: {
            character: true,
            type: true
        }
    });
};

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

/**
 * Retrieves all events for a specific RPG with pagination.
 * 
 * @param rpgId - The ID of the RPG whose events are to be retrieved.
 * @param page - The page number.
 * @param limit - The number of events per page.
 * @returns A list of events that belong to the specified RPG.
 */
export const getEventsByRPGId = (rpgId: number, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return db.event.findMany({
        where: {
            character: {
                rpgId: rpgId
            }
        },
        include: {
            character: true,
            type: true
        },
        skip: offset,
        take: limit
    });
};