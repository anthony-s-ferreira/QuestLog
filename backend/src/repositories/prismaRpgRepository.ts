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
 * Retrieves all RPGs.
 * 
 * @returns A list of all RPGs.
 */
export const getAllRpgs = () => {
    return db.rPG.findMany(
        {
            include: {
                master: true
            }
        }
    );
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