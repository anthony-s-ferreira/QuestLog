import { RPGDTO } from "../domain/DTO/RpgDTO";
import { RPG } from "../domain/entities/Rpg";
import { User } from "../domain/entities/User";
import { RPGFormDTO } from "../domain/formDTO/RpgFormDTO";
import * as repository from "../repositories/prismaRpgRepository";
import { validateId, validateLimit, validatePage } from "../validators/CommonValidator";
import { validateRPGDescription, validateRPGExists, validateRPGName, validateRPGStatus } from "../validators/RpgValidator";
import { validateUserExists } from "../validators/UserValidator";
import { UserService } from "./UserService";

const userService = new UserService();
export class RpgService {

    /**
     * Creates a new RPG.
     * 
     * @param rpgFormDTO - The RPG data to be created.
     * @returns The created RPG.
     */
    async createRPG(rpgFormDTO: RPGFormDTO) {
        validateRPGName(rpgFormDTO.name);
        validateRPGDescription(rpgFormDTO.description);
        validateId(rpgFormDTO.masterid, 'User');
        validateRPGStatus(rpgFormDTO.active);
        const rpg = await repository.createRpg(rpgFormDTO);
        return this.convertRPG(rpg);
    }

    /**
     * Retrieves all RPGs paginated.
     * 
     * @param page - The page number.
     * @param limit - The number of items per page.
     * 
     * @returns A list of all RPGs paginated.
     */
    async getAllRPGs(page: number, limit: number) {
        page = page || 1;
        limit = limit || 10;
        
        validatePage(page);
        validateLimit(limit);
        const rpgs = await repository.getAllRpgs(page, limit);
        return rpgs.map(rpg => this.convertRPG(rpg));
    }

    /**
     * Retrieves an RPG by ID.
     * 
     * @param id - The ID of the RPG to be retrieved.
     * @returns The RPG with the specified ID.
     */
    async getRPGById(id: number) {
        validateId(id, 'RPG');
        await validateRPGExists(id);
        const rpg = await repository.getRpgById(id);
        return this.convertRPG(rpg);
    }

    /**
     * Updates an RPG by ID.
     * 
     * @param id - The ID of the RPG to be updated.
     * @param rpgFormDTO - The RPG data to be updated.
     * @returns The updated RPG.
     */
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

    /**
     * Retrieves all RPGs by user ID.
     * 
     * @param userId - The ID of the user whose RPGs are to be retrieved.
     * @returns A list of all RPGs by the specified user.
     */
    async getRPGByUserId(userId: number) {
        validateId(userId, 'User');
        await validateUserExists(userId);
        const rpgs = await repository.getRpgsByUserId(userId);
        return rpgs.map(rpg => this.convertRPG(rpg));
    }

    /**
     * Updates the status of an RPG by ID.
     * 
     * @param id - The ID of the RPG whose status is to be updated.
     * @param active - The new status of the RPG.
     * @returns The updated RPG.
     */
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

    /**
     * Deletes an RPG by ID.
     * 
     * @param id - The ID of the RPG to be deleted.
     * @returns The result of the deletion.
     */
    async deleteRPG(id: number) {
        validateId(id, 'RPG');
        await validateRPGExists(id);
        return await repository.deleteRPGById(id);
    }

    /**
     * Verifies if an user is in a RPG.
     * 
     * @param rpgId - The ID of the RPG to be validated.
     * @param userId - The ID of the user to be validated.
     * @returns 
     */
    async validateUserInRPG(rpgId: number, userId: number) {
        validateId(rpgId, 'RPG');
        validateId(userId, 'User');
        await validateRPGExists(rpgId);
        await validateUserExists(userId);
        const rpg = await repository.getRpgUsers(rpgId);
        if (rpg?.masterid === userId) {
            return true;
        }
        if (rpg?.characters.find(character => character.ownerId === userId)) {
            return true;
        }
        return false;
    }

    /**
     * Converts an RPG entity to an RPG DTO.
     * 
     * @param rpg - The RPG entity to be converted.
     * @returns The RPG DTO.
     */
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