import * as repository from "../repositories/prismaUserRepository";
import { User, UserType } from "../domain/entities/User";

export class UserService {

    async createUser(name: string, email: string, password: string, type: string) {
        const user = { name, email, password, type: type as UserType } as User;
        return repository.createUser(user);
    }

    async getAllUsers() {
        return await repository.getAllUsers();
    }

    async getUserById(id: number) {
        return await repository.getUserById(id);
    }

    async updateUser(id: number, name: string, email: string, type: string) {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error("User not found.");
        }

        user.name = name;
        user.email = email;
        user.type = type as UserType;

        return repository.updateUser(id, user);
    }

    async updateUserPassword(id: number, newPassword: string) {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error("User not found.");
        }

        user.password = newPassword;

        return repository.updateUserPassword(id, newPassword);
    }

    async deleteUser(id: number) {
        return repository.deleteUserById(id);
    }
}