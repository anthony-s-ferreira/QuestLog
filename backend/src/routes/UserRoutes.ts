import { Router } from "express";
import { createUser, getAllUsers, getUserById, updateUser, updateUserPassword, deleteUser, login } from "../controllers/UserController";
import authMiddleware from "../middlewares/authMiddleware";
import { AdminPermissionMiddleware, UserEditPermissionMiddleware } from "../middlewares/permissionMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints for user management
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Create a new user
 *     description: Adds a new user to the system.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@email.com"
 *               password:
 *                 type: string
 *                 example: "123456@Ab"
 *               type:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Invalid input data.
 */
router.post("/user/register", createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a user by their unique ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found.
 *       404:
 *         description: User not found.
 */
router.get("/users/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     description: Updates a user's name, email, and type.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 example: "john.updated@email.com"
 *               type:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "newpassword"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid data.
 *       404:
 *         description: User not found.
 */
router.put("/users/:id", authMiddleware, UserEditPermissionMiddleware, updateUser);

/**
 * @swagger
 * /users/{id}/password:
 *   patch:
 *     summary: Update user password
 *     description: Updates only the user's password.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "oldpassword"
 *               newPassword:
 *                 type: string
 *                 example: "newsecurepassword"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid data.
 *       404:
 *         description: User not found.
 */
router.patch("/users/:id/password", authMiddleware, updateUserPassword);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Removes a user from the system.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete("/users/:id", authMiddleware, UserEditPermissionMiddleware, deleteUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user
 *     description: Log in a user to the system.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - type
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@email.com"
 *               password:
 *                 type: string
 *                 example: "123456@Ab"
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post("/user/login", login);


export { router as userRoutes };
