import { Response } from 'express';
import { RPG } from "../domain/entities/Rpg";
import { UserService } from '../services/UserService';
import { RpgService } from '../services/RpgService';

const userService = new UserService();
const rpgService = new RpgService();

export const validateRequestBody = (body: RPG, res: Response) => {
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'Rpg is required.' });
        throw new Error('Rpg is required.');
      }
}

export const validateRPGName = (name: string, res: Response) => {
    if (!name || name.trim() === "") {
        res.status(400).json({message: 'RPG name is required.'});
        throw new Error('RPG name is required.');
    }
    if (name.length < 3) {
        res.status(400).json({message: 'RPG name must have at least 3 characters.'});
        throw new Error('RPG name must have at least 3 characters.');
    }
    if (name.length > 20) {
        res.status(400).json({message: 'RPG name must have at most 20 characters.'});
        throw new Error('RPG name must have at most 20 characters.');
    }
}

export const validateRPGDescription = (description: string, res: Response) => {
    if (!description || description.trim() === "") {
        res.status(400).json({message: 'RPG description is required.'});
        throw new Error('RPG description is required.');
    }
    if (description.length < 20) {
        res.status(400).json({message: 'RPG description must have at least 3 characters.'});
        throw new Error('RPG description must have at least 3 characters.');
    }
    if (description.length > 200) {
        res.status(400).json({message: 'RPG description must have at most 200 characters.'});
        throw new Error('RPG name must have at most 200 characters.');
    }
}

export const validateRPGMaster = async (masterId: number, res: Response) => {
    if (!masterId) {
        res.status(400).json( {message: 'Master id is required.'})
        throw new Error('Master id is required.');
    }
    const user = await userService.getUserById(masterId);
    if (!user) {
        res.status(404).json( {message: `User with id ${masterId} not found.`} );
        throw new Error(`User with id ${masterId} not found`);
    }
}

export const validateRPGStatus = (status: boolean, res: Response) => {
    if (status === undefined) {
        res.status(400).json( { message: 'RPG status is required.' } );
        throw new Error('RPG status is required.');
    }
}

export const validateRPGId = async (id: number, res: Response) => {
    if (!id) {
        res.status(400).json( { message: 'RPG id is required.' } );
        throw new Error('RPG id is required.');
    }
    const rpg = await rpgService.getRPGById(id);
    if (!rpg) {
        res.status(404).json( {message: `RPG with id: ${id} does not exist.`} );
        throw new Error(`RPG with id: ${id} does not exist.`);
    }
}