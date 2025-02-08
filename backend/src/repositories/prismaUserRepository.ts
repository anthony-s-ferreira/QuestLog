import { db } from "../../config/database";

export const createUser = ( input: any ) => {
    return db.user.create({ data: input });
}

export const getAllUsers = () => {
    return db.user.findMany();
}

export const getUserById = (id: number) => {
    return db.user.findUnique({where: {id}});
}