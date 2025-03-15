import { RPG } from "@prisma/client";
import { db } from "../../config/database";

/**
 * Creates a new RPG.
 * 
 * @param input - The RPG data to be created.
 * @returns The created RPG.
 */
export const createRpg = (input: any) => {
    return db.rPG.create(
        { 
            data: input, 
            include: {
                master: true 
            }
        }
    );
}

/**
 * Retrieves all RPGs with pagination.
 * 
 * @param page - The page number.
 * @param limit - The number of RPGs per page.
 * @returns A list of RPGs.
 */
export const getAllRpgs = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return db.rPG.findMany({
        skip: offset,
        take: limit,
        include: {
            master: true
        }
    });
};

/**
 * Retrieves an RPG by ID.
 * 
 * @param id - The ID of the RPG to be retrieved.
 * @returns The RPG with the specified ID.
 */
export const getRpgById = (id: number) => {
    return db.rPG.findUnique(
        { 
            where: { id }, 
            include: {
                master: true
            }
        }
    );
}

/**
 * Updates an RPG by ID.
 * 
 * @param id - The ID of the RPG to be updated.
 * @param input - The RPG data to be updated.
 * @returns The updated RPG.
 */
export const updateRpg = (id: number, input: any) => {
    return db.rPG.update(
        {
            where: { id }, 
            data: {name: input.name, description: input.description}, 
            include: {
                master: true
            }
        }
    );
}

/**
 * Updates the status of an RPG by ID.
 * 
 * @param id - The ID of the RPG whose status is to be updated.
 * @param rpg - The RPG data to be updated.
 * @returns The updated RPG.
 */
export const updateRPGStatus = async (id: number, rpg: RPG) => {
    return db.rPG.update(
        {
            where: { id }, 
            data: rpg, 
            include: {
                master: true
            }
        }
    );
}

/**
 * Deletes an RPG by ID.
 * 
 * @param id - The ID of the RPG to be deleted.
 * @returns The result of the deletion.
 */
export const deleteRPGById = (id: number) => {
    return db.rPG.delete({ where: { id } });
}

/**
 * Retrieves all RPGs for a specific user.
 * 
 * @param userId - The ID of the user whose RPGs are to be retrieved.
 * @returns A list of RPGs that belong to or include the specified user.
 */
export const getRpgsByUserId = (userId: number) => {
    return db.rPG.findMany({
        where: {
            OR: [
                { masterid: userId },
                { characters: { some: { ownerId: userId } } }
            ]
        },
        include: {
            master: true
        }
    });
};

export function getRpgUsers(rpgId: number) {
    return db.rPG.findUnique({where: {id: rpgId}, include: {characters: true}});
}
