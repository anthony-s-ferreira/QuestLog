import { RPG } from "./Rpg";
import { User } from "./User";
/**
 * Represents a character in the RPG system.
 * 
 * @interface Character
 * @property {number} id - The unique identifier for the character.
 * @property {string} name - The name of the character.
 * @property {User} owner - The user who owns the character.
 * @property {RPG} rpg - The RPG game to which the character belongs.
 */


export interface Character {
    id: number;
    name: string;
    owner: User;
    rpg: RPG;
}
