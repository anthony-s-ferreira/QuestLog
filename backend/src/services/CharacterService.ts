import { Character } from "../domain/entities/Character";
import * as repository from "../repositories/prismaCharacterRepository";
import { RpgService } from "./RpgService";
import { CharacterFormDTO } from "../domain/formDTO/CharacterFormDTO";
import { validateCharacterExists, validateCharacterName, validateRequestBody } from "../validators/CharacterValidator";
import { validateId } from "../validators/CommonValidator";
import { validateUserExists } from "../validators/UserValidator";
import { validateRPGExists } from "../validators/RpgValidator";
import { CharacterDTO } from "../domain/DTO/CharacterDTO";
import { UserService } from "./UserService";
import { RPG } from "../domain/entities/Rpg";
import { User } from "../domain/entities/User";

const rpgService = new RpgService();
const userService = new UserService();

export class CharacterService {
    
    async createCharacter(charForm: CharacterFormDTO) {
        validateCharacterName(charForm.name);
        validateId(charForm.ownerId, 'Owner');
        validateId(charForm.rpgId, 'RPG');
        validateUserExists(charForm.ownerId);
        validateRPGExists(charForm.rpgId);

        const char = await repository.createCharacter(charForm);
        return await this.convertCharacter(char);
    }

    async getAllCharacters() {
        const characters = await repository.getAllCharacters();
        return await characters.map(char => this.convertCharacter(char));
    }

    async getCharacterById(id: number) {
        validateId(id, 'Character');
        await validateCharacterExists(id);
        const character = await repository.getCharacterById(id);
        return await this.convertCharacter(character);
    }

    async updateCharacter(id: number, name: string) {
        validateId(id, 'Character');
        await validateCharacterExists(id);
        validateCharacterName(name);
        validateCharacterName(name);
        const character = await repository.getCharacterById(id);
        character.name = name;

        const updatedChar = await repository.updateCharacter(id, character);
        return await this.convertCharacter(updatedChar);
    }

    async deleteCharacter(id: number) {
        return await repository.deleteCharacterById(id);
    }

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