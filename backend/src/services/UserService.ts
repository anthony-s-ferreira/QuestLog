import * as repository from "../repositories/prismaUserRepository";
import { User, UserType } from "../domain/entities/User"; // Adjust the import path as necessary

export class UserService {

    async createUser(name: string, email: string, password: string, type: string) {
        const user = {name, email, password, type} as User;
        return await repository.createUser(user);
    }

    async getAllUsers() {
        return await repository.getAllUsers();
    }

    async getUserById(id: number) {
        return await repository.getUserById(id);
    }
}