import { db } from "../../config/database";

/**
 * Creates a new user.
 * 
 * @param input - The user data to be created.
 * @returns The created user.
 */
export const createUser = (input: any) => {
    return db.user.create({ data: input });
};

/**
 * Retrieves all users with pagination.
 * 
 * @param page - The page number.
 * @param limit - The number of users per page.
 * @returns A list of users.
 */
export const getAllUsers = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return db.user.findMany({
        skip: offset,
        take: limit
    });
};

/**
 * Retrieves a user by ID.
 * 
 * @param id - The ID of the user to be retrieved.
 * @returns The user with the specified ID.
 */
export const getUserById = (id: number) => {
    return db.user.findUnique({ where: { id } });
};

/**
 * Updates a user by ID.
 * 
 * @param id - The ID of the user to be updated.
 * @param data - The user data to be updated.
 * @returns The updated user.
 */
export const updateUser = (id: number, data: any) => {
    return db.user.update({
        where: { id },
        data
    });
};

/**
 * Updates a user's password by ID.
 * 
 * @param id - The ID of the user whose password is to be updated.
 * @param newPassword - The new password.
 * @returns The updated user.
 */
export const updateUserPassword = (id: number, newPassword: string) => {
    return db.user.update({
        where: { id },
        data: { password: newPassword }
    });
};

/**
 * Deletes a user by ID.
 * 
 * @param id - The ID of the user to be deleted.
 * @returns The result of the deletion.
 */
export const deleteUserById = (id: number) => {
    return db.user.delete({ where: { id } });
};

/**
 * Retrieves a user by email.
 * 
 * @param email - The email of the user to be retrieved.
 * @returns The user with the specified email.
 */
export const getUserByEmail = (email: string) => {
    return db.user.findUnique({ where: { email } });
}

/**
 * Sets a user admin.
 * @param userId - The ID of the user to be set as admin.
 * @returns The updated user.
 */
export function setUserAdmin(userId: number) {
    return db.user.update({
        where: {id: userId},
        data: {type: 'admin'}
    })
}

