import { Character } from "../domain/entities/Character";
import * as repository from "../repositories/prismaCharacterRepository";
import { UserService } from "./UserService";
import { RpgService } from "./RpgService";

const userService = new UserService();
const rpgService = new RpgService();


export class CharacterService {
    
    async createCharacter(name: string, ownerId: number, rpgId: number) {
        const owner = await userService.getUserById(ownerId);
        const rpg = await rpgService.getRPGById(rpgId);

        if (!owner) throw new Error("User not found");
        if (!rpg) throw new Error("RPG not found");

        const character = { 
            name, 
            owner: { connect: { id: owner.id } }, 
            rpg: { connect: { id: rpg.id } } 
        };
        return repository.createCharacter(character);
    }

    async getAllCharacters() {
        return repository.getAllCharacters();
    }

    async getCharacterById(id: number) {
        return repository.getCharacterById(id);
    }

    async updateCharacter(id: number, name: string, rpgId: number) {
        const character = await this.getCharacterById(id);
        const rpg = await rpgService.getRPGById(rpgId);

        if (!character) throw new Error("Character not found");
        if (!rpg) throw new Error("RPG not found");

        character.name = name;
        character.rpg = { connect: { id: rpg.id } };

        return repository.updateCharacter(id, character);
    }

    async deleteCharacter(id: number) {
        return repository.deleteCharacterById(id);
    }
}