import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { RpgService } from '../services/RpgService';
import { EventService } from '../services/EventService';
import { CharacterService } from '../services/CharacterService';

const userService = new UserService();
const rpgService = new RpgService();
const eventService = new EventService();
const characterService = new CharacterService();

const RPGEditPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        const rpgId = req.params.id;
        const rpg = await rpgService.getRPGById(Number(rpgId));
        if (rpg.master.id === req.body.userId) {
            next();
        }
        else {
            res.status(403).send('Access denied. You do not have permission to edit this RPG.');
            throw new Error('Access denied. You do not have permission to edit this RPG.')
        }
    }
};

const RPGPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        const rpgId = req.params.id;
        
        if (await rpgService.validateUserInRPG(Number(rpgId), req.body.userId)) {
            next();
        }
        else {
            res.status(403).send('Access denied. You do not have permission to access this RPG.');
            throw new Error('Access denied. You do not have permission to access this RPG.')
        }
    }
};

const EventEditPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        const eventId = req.params.id; 
        const event = await eventService.getEvent(Number(eventId));
        if (await rpgService.validateUserInRPG(event.character.rpg.id, req.body.userId)) {
            next();
        }
        else {
            res.status(403).send('Access denied. You do not have permission to access this Event.');
            throw new Error('Access denied. You do not have permission to access this Event.')
        }
    }
};

const EventTypePermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        res.status(403).send('Access denied. You do not have permission to edit event types.');
        throw new Error('Access denied. You do not have permission to edit event types.')
    }
}

const UserEditPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        const userId = req.params.id;
        if (userId === req.body.userId) {
            next();
        }
        else {
            res.status(403).send('Access denied. You do not have permission to edit this user.');
            throw new Error('Access denied. You do not have permission to edit this user.')
        }
    }
};

const CharacterEditPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        const characterId = req.params.id;
        const character = await characterService.getCharacterById(Number(characterId));
        if (character.owner.id === req.body.userId) {
            next();
        }
        else {
            res.status(403).send('Access denied. You do not have permission to edit this character.');
            throw new Error('Access denied. You do not have permission to edit this character.')
        }
    }
};

const CharacterPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        const characterId = req.params.id;
        const character = await characterService.getCharacterById(Number(characterId));
        if (await rpgService.validateUserInRPG(character.rpg.id, req.body.userId)) {
            next();
        }
        else {
            res.status(403).send('Access denied. You do not have permission to access this character.');
            throw new Error('Access denied. You do not have permission to access this character.')
        }
    }
};

const AdminPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await validateAdmin(req, res)) {
        next();
    }
    else {
        res.status(403).send('Access denied. You do not have permission to access this resource.');
        throw new Error('Access denied. You do not have permission to access this resource.')
    }
}

const validateAdmin = async (req: Request, res: Response) => { 
    const user = await userService.getUserById(req.body.userId);
    if (user.type === 'admin') {
        return true;
    }
    return false;
};

export { RPGEditPermissionMiddleware, EventEditPermissionMiddleware, EventTypePermissionMiddleware, UserEditPermissionMiddleware, AdminPermissionMiddleware, CharacterPermissionMiddleware, CharacterEditPermissionMiddleware, RPGPermissionMiddleware };

