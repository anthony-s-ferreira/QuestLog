import { Response } from 'express';
import { User } from "../domain/entities/User";
import { validateId } from './CommonValidator';
import { UserService } from '../services/UserService';
import { UserFormDTO } from '../domain/formDTO/UserFormDTO';
import * as repository from '../repositories/prismaUserRepository';

export const validateRequestBody = (body: UserFormDTO, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'User is required.' });
        throw new Error('User is required.');
      }
    try {
        validateUserName(body.name);
        validateUserEmail(body.email);
        validateUserPassword(body.password);
        validateUserType(body.type);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const validateUserName = (name: string) => {
    if (!name || name.trim() === "") {
        throw new Error('User name is required.');
    }
    if (name.length < 3) {
        throw new Error('User name must have at least 3 characters.');
    }
    if (name.length > 20) {
        throw new Error('User name must have at most 20 characters.');
    }
}

export const validateUserEmail = (email: string) => {
    if (!email || email.trim() === "") {
        throw new Error('User email is required.');
    }
    if (email.length < 5) {
        throw new Error('User email must have at least 5 characters.');
    }
    if (email.length > 256) {
        throw new Error('User email must have at most 256 characters.');
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error('User email must be a valid email address.');
    }

}

export const validateUserPassword = (password: string) => {
    if (!password || password.trim() === "") {
        throw new Error('User password is required.');
    }
    if (password.length < 8) {
        throw new Error('User password must have at least 8 characters.');
    }
    if (password.length > 256) {
        throw new Error('User password must have at most 256 characters.');
    }

    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
        throw new Error('User password must contain at least one uppercase letter.');
    }

    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
        throw new Error('User password must contain at least one lowercase letter.');
    }

    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
        throw new Error('User password must contain at least one number.');
    }

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialChar) {
        throw new Error('User password must contain at least one special character.');
    }
}

export const validateUserType = (type: string) => {
    if (!type || type.trim() === "") {
        throw new Error('User type is required.');
    }
    
    if (type != 'admin' && type != 'user') {
        throw new Error('User type must be either admin or user.');
    }
} 

export const validateUserExists = async (id: number) => {
    const User = await repository.getUserById(id);
    if (!User) {
        throw new Error('User not found.');
    }
}

export const validateNewPassword = async (id: number, password: string, newPassword: string) => {
    const user = await repository.getUserById(id);
    if (user.password !== password) {
        throw new Error('Current password is incorrect');
    }
    if (user.password === newPassword) {
        throw new Error('New password must be different from the current password');
    }
}

export const validateUserPasswordUpdate = async (id: number, password: string, newPassword: string, res: Response) => {
    try {
        validateUserPassword(password);
        validateNewPassword(id, password, newPassword);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const validateUserId = async (id: number, res: Response) => {
    try {
        validateId(id, 'User');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    try {
        await validateUserExists(id);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}