/**
 * Data Transfer Object (DTO) for character form.
 * This interface represents the structure of the data required
 * to create or update a character in the system.
 */
export interface CharacterFormDTO {
    name: string;
    ownerId: number;
    rpgId: number;
}