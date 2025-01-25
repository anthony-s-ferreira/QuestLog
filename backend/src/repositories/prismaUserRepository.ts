import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./userRepository";
import { User } from "../domain/entities/User";

const prisma = new PrismaClient();

export class PrismaUserRepository implements UserRepository{
    create(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }

    getByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    getAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    update(user: User): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    deleteByEmail(email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
