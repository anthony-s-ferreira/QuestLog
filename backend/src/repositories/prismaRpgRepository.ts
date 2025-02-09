import { db } from "../../config/database";

export const createRpg = ( input: any ) => {
    return db.rPG.create({ data: input, include: {
        master: {
            select: {
                id: true,
                name: true,
            }
        }
    } });
}

export const getAllRpgs = () => {
    return db.rPG.findMany( {
        include: {
            master: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
};


export const getRpgById = ( id: number ) => {
    return db.rPG.findUnique({ where: { id }, include: {
        master: {
            select: {
                id: true,
                name: true,
            }
        }
    } });
}

export const updateRpg = ( id: number, input: any ) => {
    return db.rPG.update({ where: { id }, data: input, include: {
        master: {
            select: {
                id: true,
                name: true,
            }
        }
    } });
}

export const updateRPGStatus = async (id: number, active: boolean) => {
    const rpg = await getRpgById(id);
    if (rpg) {
        rpg.active = active;
        return db.rPG.update({where: {id}, data: rpg, include: {
            master: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }});
    }
}

export const deleteRPGById = (id: number) => {
    return db.rPG.delete({where: {id}})
}