import { RPG } from "@prisma/client";
import { db } from "../../config/database";

export const createRpg = ( input: any ) => {
    return db.rPG.create(
        { 
            data: input, 
            include: {
                master: true 
            }
        }
    );
}

export const getAllRpgs = () => {
    return db.rPG.findMany(
        {
            include: {
                master: true
            }
        }
    )
};


export const getRpgById = ( id: number ) => {
    return db.rPG.findUnique(
        { 
            where: { id }, 
            include: {
                master: true
            }
        }
    );
}

export const updateRpg = ( id: number, input: any ) => {
    return db.rPG.update(
        {
            where: { id }, 
            data: input, 
            include: {
                master: true
            }
        }
    );
}

export const updateRPGStatus = async (id: number, rpg: RPG) => {

    return db.rPG.update(
        {
            where: {id}, 
            data: rpg, 
            include: {
                master: true
            }
        }
    );
}

export const deleteRPGById = (id: number) => {
    return db.rPG.delete({where: {id}})
}