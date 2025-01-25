import { User } from "../domain/entities/User";

export interface UserRepository {
    create(user: User): Promise<User>;
    getByEmail(email: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    update(user: User): Promise<User | null>;
    deleteByEmail(email: string): Promise<boolean>;
}