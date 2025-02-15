import { RPGDTO } from "../domain/DTO/RpgDTO";
import { RPG } from "../domain/entities/Rpg";
import { User } from "../domain/entities/User";
import { RPGFormDTO } from "../domain/formDTO/RpgFormDTO";
import * as repository from "../repositories/prismaRpgRepository";
import { validateId } from "../validators/CommonValidator";
import { validateRPGDescription, validateRPGExists, validateRPGName, validateRPGStatus } from "../validators/RpgValidator";
import { UserService } from "./UserService";

const userService = new UserService();

export class RpgService {

    async createRPG(rpgFormDTO: RPGFormDTO) {
        validateRPGName(rpgFormDTO.name);
        validateRPGDescription(rpgFormDTO.description);
        validateId(rpgFormDTO.master, 'User');
        validateRPGStatus(rpgFormDTO.active);
        const rpg = await repository.createRpg(rpgFormDTO);
        return this.convertRPG(rpg);
    }

    async getAllRPGs() {
            const rpgs = await repository.getAllRpgs();
            return rpgs.map(rpg => this.convertRPG(rpg));
        }

    async getRPGById(id: number) {
        validateId(id, 'RPG');
        await validateRPGExists(id);
        const rpg = await repository.getRpgById(id);
        return this.convertRPG(rpg);
    }

    async updateRPG(id: number, rpgFormDTO: RPGFormDTO) {
        validateId(id, 'RPG');
        await validateRPGExists(id);
        validateRPGName(rpgFormDTO.name);
        validateRPGDescription(rpgFormDTO.description);
        const rpg = await this.getRPGById(id);
        if (rpg) {
            rpg.name = rpgFormDTO.name;
            rpg.description = rpgFormDTO.description;
        }
        const updatedRPG = await repository.updateRpg(id, rpg);
        return this.convertRPG(updatedRPG);
    }

    async updateRPGStatus(id: number, active: boolean) {
        validateId(id, 'RPG');
        await validateRPGExists(id);
        validateRPGStatus(active);
        const rpg = await repository.getRpgById(id);
        if (rpg) {
            rpg.active = active;
            const updatedRpg = await repository.updateRPGStatus(id, rpg);
            return this.convertRPG(updatedRpg);
        }
    }

    async deleteRPG(id: number) {
        validateId(id, 'RPG');
        await validateRPGExists(id);
        return await repository.deleteRPGById(id);
    }

    convertRPG(rpg: RPG): RPGDTO {
        const user = userService.convertUser(rpg.master as User);
        return {
            id: rpg.id,
            name: rpg.name,
            description: rpg.description,
            master: user,
            active: rpg.active
        }
    }

}