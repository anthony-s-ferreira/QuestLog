import { db } from "../../config/database";

export const createEvent = (input: any) => {
    return db.event.create({
        data: input,
        include: {
            character: {
                select: {
                    id: true,
                    name: true,
                }
            },
            type: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
};

export const updateEvent = (id: number, input: any) => {
    return db.event.update({
        data: input, 
        where: {id},
        include: {
            character: {
                select: {
                    id: true,
                    name: true,
                }
            },
            type: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
    });
};

export const getEvents = () => {
    return db.event.findMany({
        include: {
            character: {
                select: {
                    id: true,
                    name: true,
                }
            },
            type: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
    });
}

export const getEvent = (id: number) => {
    return db.event.findUnique({where: {id},
        include: {
            character: {
                select: {
                    id: true,
                    name: true,
                }
            },
            type: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
    })
}

export const deleteEvent = (id: number) => {
    return db.event.delete({where: {id}})
}