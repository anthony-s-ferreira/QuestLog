import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const userController = new UserController();

userRouter.post('/users', userController.register);
userRouter.post('/users/login', userController.login);
userRouter.put('/users', userController.update);
userRouter.patch('/users', userController.updatePassword);
userRouter.delete('/users', userController.delete);
userRouter.get('/users/:email', userController.getUser);