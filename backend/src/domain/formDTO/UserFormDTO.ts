import { UserType } from "../enums/UserType";

/**
 * Data Transfer Object for user form.
 * 
 * @interface UserFormDTO
 * 
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password for the user account.
 * @property {UserType} type - The type of the user, defined by the UserType enum.
 */
export interface UserFormDTO {
    name: string;
    email: string;
    password: string;
    type: UserType
}
