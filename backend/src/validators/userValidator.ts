import { UserService } from '../services/userService';
import { Response } from 'express';
import { User } from '../domain/entities/User';

export const validateRequestBody = (res: Response, body: User) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({error: 'Request body is empty'});
        throw new Error('Request body is empty');
    }
};

export const validateUserName = (res: Response, name: string) => {
    name = name.trim();
    if (!name) {
        res.status(400).json({error: 'Name is required'});
        throw new Error('Name is required');
    }
    if (name.length < 3) {
        res.status(400).json({error: 'Name must have at least 3 characters'});
        throw new Error('Name must have at least 3 characters');
    }
    if (name.length > 50) {
        res.status(400).json({error: 'Name must have at most 50 characters'});
        throw new Error('Name must have at most 50 characters');
    }
};

export const validateUserEmail = (res: Response, email: string) => {
    if (!email) {
        res.status(400).json({error: 'Email is required'});
        throw new Error('Email is required');
    }
    if (email.length < 8) {
        res.status(400).json({error: 'Email must have at least 8 characters'});
        throw new Error('Email must have at least 8 characters');
    }
    if (email.length > 320) {
        res.status(400).json({error: 'Email must have at most 320 characters'});
        throw new Error('Email must have at most 320 characters');
    }
    if (!email.includes('@') || !email.includes('.')) {
        res.status(400).json({error: 'Email is invalid'});
        throw new Error('Email is invalid');
    }

    const user = UserService.getUserByEmail(email);
    if (user) {
        res.status(400).json({error: 'Email already exists'});
        throw new Error('Email already exists');
    }
};

export const validateUserPassword = (res: Response, password: string) => {
    if (!password) {
        res.status(400).json({error: 'Password is required'});
        throw new Error('Password is required');
    }
    if (password.length < 6) {
        res.status(400).json({error: 'Password must have at least 6 characters'});
        throw new Error('Password must have at least 6 characters');
    }
    if (password.length > 50) {
        res.status(400).json({error: 'Password must have at most 50 characters'});
        throw new Error('Password must have at most 50 characters');
    }
    if (!password.match(/[0-9]/)) {
        res.status(400).json({error: 'Password must have at least one number'});
        throw new Error('Password must have at least one number');
    }
    if (!password.match(/[a-z]/)) {
        res.status(400).json({error: 'Password must have at least one lowercase letter'});
        throw new Error('Password must have at least one lowercase letter');
    }
    if (!password.match(/[A-Z]/)) {
        res.status(400).json({error: 'Password must have at least one uppercase letter'});
        throw new Error('Password must have at least one uppercase letter');
    }
    if (!password.match(/[^a-zA-Z0-9]/)) {
        res.status(400).json({error: 'Password must have at least one special character'});
        throw new Error('Password must have at least one special character');
    }
};