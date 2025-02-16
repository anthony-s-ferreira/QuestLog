/**
 * Data Transfer Object (DTO) for User.
 * This interface represents the structure of a user object
 * that is used to transfer data between different layers of the application.
 *
 * @property {number} id - The unique identifier of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {UserType} type - The type of the user, represented by the UserType enum.
 */
import { UserType } from "../enums/UserType";

export interface UserDTO {
    id: number;
    name: string;
    email: string;
    type: UserType
}