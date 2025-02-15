import { User } from "@prisma/client";

export interface RPG {
    id: number,
    name: string,
    description: string,
    master: User,
    active: boolean
}