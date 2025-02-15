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