import * as repository from "../repositories/prismaUserRepository";
import { User } from "../domain/entities/User";
import { validateUserEmail, validateUserName, validateUserPassword, validateUserType } from "../validators/UserValidator";
import { validateId } from "../validators/CommonValidator";
import { UserDTO } from "../domain/DTO/UserDTO";
import { UserFormDTO } from "../domain/formDTO/UserFormDTO";
import { UserType } from "../domain/enums/UserType";
import { generateToken } from "../config/jwt";
import bcrypt from "bcrypt";
import { login } from "./AuthService";

export class UserService {

    /**
     * Creates a new user.
     * 
     * @param userForm - The user data to be created.
     * @returns The user's token.
     */
    async createUser(userForm: UserFormDTO) {
        validateUserName(userForm.name);
        validateUserEmail(userForm.email);
        validateUserType(userForm.type);
        validateUserPassword(userForm.password);
        const hashedPassword = await bcrypt.hash(userForm.password, 10);
        const user = { 
            name: userForm.name, 
            email: userForm.email, 
            password: hashedPassword, 
            type: userForm.type as UserType
        } as User;
        return generateToken((await repository.createUser(user)).id);
    }

    /**
     * Retrieves all users.
     * 
     * @returns A list of all users.
     */
    async getAllUsers() {
        const users = await repository.getAllUsers();
        return users.map(user => this.convertUser({
            ...user,
            type: user.type as UserType
        }));
    }

    /**
     * Retrieves a user by ID.
     * 
     * @param id - The ID of the user to be retrieved.
     * @returns The user with the specified ID.
     */
    async getUserById(id: number) {
        validateId(id, 'User');
        await this.validateUserExists(id);

        const user = await repository.getUserById(id);
        return this.convertUser(user);
    }

    /**
     * Updates a user by ID.
     * 
     * @param id - The ID of the user to be updated.
     * @param userForm - The user data to be updated.
     * @returns The updated user.
     */
    async updateUser(id: number, userForm: UserFormDTO) {
        validateId(id, 'User');
        await this.validateUserExists(id);
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

    /**
     * Updates a user's password by ID.
     * 
     * @param id - The ID of the user whose password is to be updated.
     * @param newPassword - The new password.
     * @returns The updated user.
     */
    async updateUserPassword(id: number, newPassword: string) {
        validateUserPassword(newPassword);
        
        const user = await this.getUser(id);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        const updatedUser = await repository.updateUserPassword(id, hashedPassword);
        return this.convertUser(updatedUser);
    }

    /**
     * Deletes a user by ID.
     * 
     * @param id - The ID of the user to be deleted.
     * @returns The result of the deletion.
     */
    async deleteUser(id: number) {
        return repository.deleteUserById(id);
    }

    /**
     * Validates a new password for a user.
     * 
     * @param id - The ID of the user.
     * @param password - The current password.
     * @param newPassword - The new password.
     * @throws {Error} - Throws an error if the validation fails.
     */
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

    /**
     * Retrieves a user by ID.
     * 
     * @param id - The ID of the user to be retrieved.
     * @returns The user with the specified ID.
     */
    async getUser(id: number) {
        validateId(id, 'User');
        await this.validateUserExists(id);
        return await repository.getUserById(id);
    }

    async getUserByEmail(email: string) {
        return await repository.getUserByEmail(email);
    }

    /**
     * Validates if a user exists by ID.
     * 
     * @param id - The ID of the user to check.
     * @throws {Error} - Throws an error if the user does not exist.
     */
    async validateUserExists(id: number) {
        validateId(id, 'User');
        const user = await repository.getUserById(id);
        if (!user) {
            throw new Error('User not found.');
        }
    }

    /**
     * Converts a user entity to a user DTO.
     * 
     * @param user - The user entity to be converted.
     * @returns The user DTO.
     */
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