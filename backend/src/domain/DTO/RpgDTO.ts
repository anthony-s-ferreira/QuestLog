import { UserDTO } from "./UserDTO";

export interface RPGDTO {
    id: number,
    name: string,
    description: string,
    master: UserDTO,
    active: boolean
}