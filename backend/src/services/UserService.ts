import * as repository from "../repositories/prismaUserRepository";
import { User } from "../domain/entities/User";
import { validateUserEmail, validateUserExists, validateUserName, validateUserPassword, validateUserType } from "../validators/UserValidator";
import { validateId } from "../validators/CommonValidator";
import { UserDTO } from "../domain/DTO/UserDTO";
import { UserFormDTO } from "../domain/formDTO/UserFormDTO";
import { UserType } from "../domain/enums/UserType";

export class UserService {

    async createUser(userForm: UserFormDTO) {
        validateUserName(userForm.name);
        validateUserEmail(userForm.email);
        validateUserType(userForm.type);
        validateUserPassword(userForm.type);

        const user = { 
            name: userForm.name, 
            email: userForm.email, 
            password: userForm.password, 
            type: userForm.type as UserType
        } as User;
        return repository.createUser(user);
    }

    async getAllUsers() {
        const users = await repository.getAllUsers();
        return users.map(user => this.convertUser({
            ...user,
            type: user.type as UserType
        }));
    }

    async getUserById(id: number) {
        validateId(id, 'User');
        validateUserExists(id);

        const user = await repository.getUserById(id);
        return this.convertUser(user);
    }

    async updateUser(id: number, userForm: UserFormDTO) {
        validateId(id, 'User');
        validateUserExists(id);
        validateUserName(userForm.name);
        validateUserEmail(userForm.email);
        validateUserType(userForm.type);

        const user = await this.getUserById(id);

        user.name = userForm.name;
        user.email = userForm.email;
        user.type = userForm.type as UserType;

        const updatedUser = await repository.updateUser(id, user);
        return this.convertUser(updatedUser);
    }

    async updateUserPassword(id: number, newPassword: string) {
        
        validateUserPassword(newPassword);
        
        const user = await this.getUser(id);
        user.password = newPassword;

        const updatedUser = await repository.updateUserPassword(id, newPassword);
        return this.convertUser(updatedUser);
    }

    async deleteUser(id: number) {
        return repository.deleteUserById(id);
    }

    async validateNewPassword(id: number, password: string, newPassword: string) {
        
        validateUserPassword(newPassword);
        
        const user = await this.getUser(id);
        if (user.password !== password) {
            throw new Error('Current password is incorrect');
        }
        if (user.password === newPassword) {
            throw new Error('New password must be different from the current password');
        }
        
    }

    async getUser(id: number) {
        validateId(id, 'User');
        validateUserExists(id);
        return await repository.getUserById(id);
    }

    convertUser(user: User) : UserDTO {
        const userDTO: UserDTO = {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type
        }
        return userDTO;
    }
}