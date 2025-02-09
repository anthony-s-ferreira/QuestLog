import { RPG } from "../domain/entities/Rpg";
import * as repository from "../repositories/prismaRpgRepository";
import { UserService } from "./UserService";

const userService = new UserService();

export class RpgService {

    async createRPG(name: string, description: string, userId: number) {
        const user = await userService.getUserById(userId);
        const rpg = {name, description, master: { connect: { id: user?.id } }, active: true};
        return repository.createRpg(rpg);
    }

    async getAllRPGs() {
        return repository.getAllRpgs();
    }

    async getRPGById(id: number) {
        return repository.getRpgById(id);
    }

    async updateRPG(id: number, name: string, description: string) {
        const rpg = await this.getRPGById(id);
        if (rpg) {
            rpg.name = name;
            rpg.description = description;
        }
        return repository.updateRpg(id, rpg);
    }

    async updateRPGStatus(id: number, active: boolean) {
        return repository.updateRPGStatus(id, active);
    }

    async deleteRPG(id: number) {
        return repository.deleteRPGById(id);
    }
}