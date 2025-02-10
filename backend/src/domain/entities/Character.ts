import { User, RPG } from "@prisma/client";

export interface Character {
    id?: number;
    name: string;
    owner: User;
    rpg?: RPG;
}
