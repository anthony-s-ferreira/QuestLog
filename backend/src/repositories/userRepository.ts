import { User, UserType } from "../models/User";

export class UserRepository {
    async createUser(name: string, email: string, password: string, type: UserType) {
        return await User.create({ name, email, password, type});
    }

    async getAllUsers() {
        return await User.findAll();
    }
}