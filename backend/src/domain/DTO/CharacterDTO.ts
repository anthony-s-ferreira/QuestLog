import { UserDTO } from "./UserDTO";
import { RPGDTO } from "./RpgDTO";

/**
 * Data Transfer Object (DTO) representing a character in the RPG system.
 * 
 * @interface CharacterDTO
 * 
 * @property {number} id - Unique identifier for the character.
 * @property {string} name - Name of the character.
 * @property {UserDTO} owner - The user who owns the character.
 * @property {RPGDTO} rpg - The RPG game to which the character belongs.
 */
export interface CharacterDTO {
    id: number;
    name: string;
    owner: UserDTO;
    rpg: RPGDTO;
}