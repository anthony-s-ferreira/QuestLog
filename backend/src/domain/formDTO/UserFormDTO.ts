import { UserType } from "../enums/UserType";

export interface UserFormDTO {
    name: string;
    email: string;
    password: string;
    type: UserType
}
