import { RPGDTO } from "./RpgDTO";
import { UserDTO } from "./UserDTO";

export interface CharacterDTO {
    id: number;
    name: string;
    owner: UserDTO;
    rpg: RPGDTO;
}