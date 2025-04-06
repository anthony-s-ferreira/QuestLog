import { db } from "../../config/database";

/**
 * Creates a new character.
 * 
 * @param input - The character data to be created.
 * @returns The created character.
 */
export const createCharacter = (input: any) => {
    return db.character.create({
        data: input,
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};

/**
 * Retrieves all characters with pagination.
 * 
 * @param page - The page number.
 * @param limit - The number of characters per page.
 * @returns A list of characters.
 */
export const getAllCharacters = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return db.character.findMany({
        skip: offset,
        take: limit,
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};

/**
 * Retrieves a character by ID.
 * 
 * @param id - The ID of the character to be retrieved.
 * @returns The character with the specified ID.
 */
export const getCharacterById = (id: number) => {
    return db.character.findUnique({
        where: { id },
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};

/**
 * Updates a character by ID.
 * 
 * @param id - The ID of the character to be updated.
 * @param input - The character data to be updated.
 * @returns The updated character.
 */
export const updateCharacter = (id: number, name: string) => {    
    return db.character.update({
        where: { id },
        data: { name },
        include: {
            owner: true,
            rpg: {
                include: { 
                    master: true 
                }
            }
        }
    });
};

/**
 * Deletes a character by ID.
 * 
 * @param id - The ID of the character to be deleted.
 * @returns The result of the deletion.
 */
export const deleteCharacterById = (id: number) => {
    return db.character.delete({ where: { id } });
};

/**
 * Retrieves all characters for a specific user.
 * 
 * @param userId - The ID of the user whose characters are to be retrieved.
 * @returns A list of characters that belong to the specified user.
 */
export const getCharactersByUserId = (userId: number) => {
    return db.character.findMany({
        where: { ownerId: userId },
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};

export const getCharactersByRPGId = async (id: number) => {
    const characters = await db.character.findMany({
      where: {
        rpgId: id
      },
      include: {
        owner: true,
        rpg: {
          include: {
            master: true
          }
        }
      }
    });
    return characters;
};
