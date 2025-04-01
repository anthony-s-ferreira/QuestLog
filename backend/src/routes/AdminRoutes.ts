import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getAllRPGs } from "../controllers/RpgController";
import { AdminPermissionMiddleware } from "../middlewares/permissionMiddleware";
import { getAllCharacters } from "../controllers/CharacterController";
import { getEvents } from "../controllers/EventController";
import { getAllUsers, setUserAdmin } from "../controllers/UserController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints for managing admin functions
 */

/**
 * @swagger
 * /admin/rpgs:
 *   get:
 *     summary: Get all RPGs
 *     description: Retrieves a list of all RPGs with pagination.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of RPGs per page
 *     responses:
 *       200:
 *         description: List of RPGs retrieved successfully.
 */
router.get('/admin/rpgs', authMiddleware, AdminPermissionMiddleware, getAllRPGs);

/**
 * @swagger
 * /admin/characters:
 *   get:
 *     summary: Get all Characters
 *     description: Retrieves a list of all Characters in the system with pagination.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of characters per page
 *     responses:
 *       200:
 *         description: List of Characters retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/admin/characters', authMiddleware, AdminPermissionMiddleware, getAllCharacters);

/**
 * @swagger
 * /admin/events:
 *   get:
 *     summary: Retrieves all events
 *     description: Returns a list of all events in the system with pagination.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of events per page
 *     responses:
 *       200:
 *         description: List of events retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/admin/events", authMiddleware, AdminPermissionMiddleware, getEvents);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get a list of users
 *     description: Returns all registered users with pagination.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of users per page
 *     responses:
 *       200:
 *         description: Successfully retrieved user list.
 */
router.get("/admin/users", authMiddleware, AdminPermissionMiddleware, getAllUsers);

/**
 * @swagger
 * /character/{id}:
 *   get:
 *     summary: Get a Character by ID
 *     description: Retrieves details of a specific Character by its ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Character ID.
 *     responses:
 *       200:
 *         description: User is now an admin.
 *       404:
 *         description: User not found.
 */
router.patch("/admin/setAdmin/:id", authMiddleware, AdminPermissionMiddleware, setUserAdmin);
export { router as adminRoutes };