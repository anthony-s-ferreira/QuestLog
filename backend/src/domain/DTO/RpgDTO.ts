import { UserDTO } from "./UserDTO";

/**
 * Represents a Role-Playing Game (RPG) Data Transfer Object (DTO).
 * This interface is used to transfer RPG data between different layers of the application.
 *
 * @interface RPGDTO
 * 
 * @property {number} id - The unique identifier of the RPG.
 * @property {string} name - The name of the RPG.
 * @property {string} description - A brief description of the RPG.
 * @property {UserDTO} master - The user who is the master of the RPG.
 * @property {boolean} active - Indicates whether the RPG is currently active.
 */
export interface RPGDTO {
    id: number,
    name: string,
    description: string,
    master: UserDTO,
    active: boolean
}