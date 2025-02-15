import { UserType } from "../enums/UserType";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    type: UserType
}
