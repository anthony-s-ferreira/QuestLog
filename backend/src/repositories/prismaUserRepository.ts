import { db } from "../../config/database";

export const createUser = (input: any) => {
    return db.user.create({ data: input });
};

export const getAllUsers = () => {
    return db.user.findMany();
};

export const getUserById = (id: number) => {
    return db.user.findUnique({ where: { id } });
};

export const updateUser = (id: number, data: any) => {
    return db.user.update({
        where: { id },
        data
    });
};

export const updateUserPassword = (id: number, newPassword: string) => {
    return db.user.update({
        where: { id },
        data: { password: newPassword }
    });
};

export const deleteUserById = (id: number) => {
    return db.user.delete({ where: { id } });
};
