import { UserType } from "../enums/UserType";

/**
 * Represents a user entity in the system.
 * 
 * @interface User
 * 
 * @property {number} id - The unique identifier of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 * @property {UserType} type - The type of the user, defined by the UserType enum.
 */
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    type: UserType
}
