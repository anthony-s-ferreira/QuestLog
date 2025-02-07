import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./userRepository";
import {User} from "../domain/entities/User"
import { db } from "../../config/database";

export const createUser = ( input: any ) => {
    return db.user.create({ data: input });
}

export const getAllUsers = () => {
    return db.user.findMany();
}