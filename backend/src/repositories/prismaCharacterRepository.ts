import { db } from "../../config/database";

export const createCharacter = (input: any) => {
    return db.character.create({
        data: input,
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};

export const getAllCharacters = () => {
    return db.character.findMany({
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};

export const getCharacterById = (id: number) => {
    return db.character.findUnique({
        where: { id },
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};


export const updateCharacter = (id: number, input: any) => {
    return db.character.update({
        where: { id },
        data: input,
        include: {
            owner: true,
            rpg: {
                include: {
                    master: true
                }
            }
        }
    });
};


export const deleteCharacterById = (id: number) => {
    return db.character.delete({ where: { id } });
};
