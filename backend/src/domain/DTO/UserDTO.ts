import { UserType } from "../enums/UserType";

export interface UserDTO {
    id: number;
    name: string;
    email: string;
    type: UserType
}