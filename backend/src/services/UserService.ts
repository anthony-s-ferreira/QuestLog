import { UserRepository } from "../repositories/userRepository";
import { User, UserType } from "../models/User";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(name: string, email: string, password: string, type: string) {
        const convertType = type as unknown as UserType;
        return await this.userRepository.createUser(name, email, password, convertType);
    }

    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }
}