import { User } from "./User";
/**
 * Represents a Role-Playing Game (RPG) entity.
 * 
 * @interface RPG
 * 
 * @property {number} id - The unique identifier of the RPG.
 * @property {string} name - The name of the RPG.
 * @property {string} description - A brief description of the RPG.
 * @property {User} master - The user who is the master of the RPG.
 * @property {boolean} active - Indicates whether the RPG is currently active.
 */

export interface RPG {
    id: number,
    name: string,
    description: string,
    master: User,
    active: boolean
}