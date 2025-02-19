/**
 * Validates an ID.
 * 
 * @param id - The ID to be validated.
 * @param type - The type of the entity to which the ID belongs (used for error messages).
 * @throws {Error} - Throws an error if the ID is invalid (not a number, missing, or negative).
 */
export const validateId = (id: number, type: string) => {
    if (typeof id !== 'number') {
        throw new Error(`${type} ID must be a number.`);
    }

    if (!id) {
        throw new Error(`${type} ID is required.`);
    }

    if (id < 0) {
        throw new Error(`${type} ID must be a positive number.`);
    }
}