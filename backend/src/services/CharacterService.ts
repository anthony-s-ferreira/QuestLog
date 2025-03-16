import { Character } from "../domain/entities/Character";
import * as repository from "../repositories/prismaCharacterRepository";
import { RpgService } from "./RpgService";
import { CharacterFormDTO } from "../domain/formDTO/CharacterFormDTO";
import { validateCharacterExists, validateCharacterName, validateRequestBody } from "../validators/CharacterValidator";
import { validateId, validateLimit, validatePage } from "../validators/CommonValidator";
import { validateUserExists } from "../validators/UserValidator";
import { validateRPGExists } from "../validators/RpgValidator";
import { CharacterDTO } from "../domain/DTO/CharacterDTO";
import { UserService } from "./UserService";

const rpgService = new RpgService();
const userService = new UserService();

export class CharacterService {

    /**
     * Creates a new character.
     * 
     * @param charForm - The character data to be created.
     * @returns The created character.
     */
    async createCharacter(charForm: CharacterFormDTO) {
        validateCharacterName(charForm.name);
        validateId(charForm.ownerId, 'Owner');
        validateId(charForm.rpgId, 'RPG');
        await validateUserExists(charForm.ownerId);
        await validateRPGExists(charForm.rpgId);

        const char = await repository.createCharacter(charForm);
        return await this.convertCharacter(char);
    }

    /**
     * Retrieves all characters paginated.
     * 
     * @param page - The page number.
     * @param limit - The number of items per page.
     * 
     * @returns A list of all characters.
     */
    async getAllCharacters(page: number, limit: number) {
        page = page || 1;
        limit = limit || 10;

        validatePage(page);
        validateLimit(limit);
        const characters = await repository.getAllCharacters(page, limit);
        return await Promise.all(characters.map(char => this.convertCharacter(char)));}

    /**
     * Retrieves a character by ID.
     * 
     * @param id - The ID of the character to be retrieved.
     * @returns The character with the specified ID.
     */
    async getCharacterById(id: number) {
        validateId(id, 'Character');
        await validateCharacterExists(id);
        const character = await repository.getCharacterById(id);
        return await this.convertCharacter(character);
    }

    /**
     * Updates a character by ID.
     * 
     * @param id - The ID of the character to be updated.
     * @param name - The new name of the character.
     * @returns The updated character.
     */
    async updateCharacter(id: number, name: string) {
        validateId(id, 'Character');
        await validateCharacterExists(id);
        validateCharacterName(name);
        const character = await repository.getCharacterById(id);
        character.name = name;
        const updatedChar = await repository.updateCharacter(id, name);
        return await this.convertCharacter(updatedChar);
    }

    /**
     * Deletes a character by ID.
     * 
     * @param id - The ID of the character to be deleted.
     * @returns The result of the deletion.
     */
    async deleteCharacter(id: number) {
        validateId(id, 'Character');
        await validateCharacterExists(id);
        return await repository.deleteCharacterById(id);
    }

    async getCharactersByUserId(userId: number) {
        validateId(userId, 'User');
        await validateUserExists(userId);
        const characters = await repository.getCharactersByUserId(userId);
        const filtered = characters.filter(c => c.owner?.id === userId);
        return Promise.all(filtered.map(c => this.convertCharacter(c)));
      }
      

    /**
     * Converts a character entity to a character DTO.
     * 
     * @param char - The character entity to be converted.
     * @returns The character DTO.
     */
    async convertCharacter(char: Character): CharacterDTO {
        const user = await userService.getUserById(char.owner.id);
        const rpg = await rpgService.getRPGById(char.rpg.id);
        return {
            id: char.id,
            name: char.name,
            owner: user,
            rpg: rpg
        };
    }
}