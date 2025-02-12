export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    type: UserType
}

export enum UserType {
    admin = 'admin',
    user = 'user'
}