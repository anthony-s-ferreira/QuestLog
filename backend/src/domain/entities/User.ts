export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    type: UserType
}

export enum UserType {
    admin = 'admin',
    user = 'user'
}