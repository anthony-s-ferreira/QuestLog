import { db } from "../../config/database";

export const createCharacter = (input: any) => {
    return db.character.create({
        data: input,
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                }
            },
            rpg: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
};

export const getAllCharacters = () => {
    return db.character.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                }
            },
            rpg: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
};

export const getCharacterById = (id: number) => {
    return db.character.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                }
            },
            rpg: {
                select: {
                    id: true,
                    name: true,
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
            owner: {
                select: {
                    id: true,
                    name: true,
                }
            },
            rpg: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
};

export const deleteCharacterById = (id: number) => {
    return db.character.delete({ where: { id } });
};
