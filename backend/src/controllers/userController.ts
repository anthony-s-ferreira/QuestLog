import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { validateUserName, validateRequestBody, validateUserEmail, validateUserPassword } from '../validators/userValidator';
export class UserController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    };

    public async register(req: Request, res: Response) {
        try{
            const {name, email, password} = req.body;
            validateRequestBody(res, {name, email, password});
            validateUserName(res, name);
            validateUserEmail(res, email);
            validateUserPassword(res, password);

            const token = await this.userService.create({name, email, password});
            res.status(201).json(token);
        } catch (error) {
            const err = error as Error;
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    };

    public async login(req: Request, res: Response) {
        try {
            validateRequestBody(res, req.body);
            const {email, password} = req.body;
            validateUserEmail(res, email);
            validateUserPassword(res, password);
            const token = await this.userService.login(email, password);
            res.status(200).json(token);
        } catch (error) {
            const err = error as Error;
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    };

    public async update(req: Request, res: Response) {
        try{
            validateRequestBody(res, req.body);
            const {name, email, password} = req.body;
            validateUserName(res, name);
            validateUserEmail(res, email);
            const user = await this.userService.update({name, email, password});
            res.json(user);
        }catch(error){
            const err = error as Error;
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    };

    public async updatePassword(req: Request, res: Response) {
        try{
            validateRequestBody(res, req.body);
            const {email, password} = req.body;
            validateUserPassword(res, password);
            const user = await this.userService.updatePassword(password);
            res.json(user);
        }catch(error){
            const err = error as Error;
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    };

    public async delete(req: Request, res: Response) {
        try{
            const user = await this.userService.delete();
            res.json(user);
        }catch(error){
            const err = error as Error;
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    };

    public async getUser(req: Request, res: Response) {
        const email = req.params.email;
        try{
            validateUserEmail(res, email);
            const user = await this.userService.getUserByEmail(email);
            res.json(user);
        }catch(error){
            const err = error as Error;
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    };

}