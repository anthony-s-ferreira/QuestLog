import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getAllRPGs } from "../controllers/RpgController";
import { AdminPermissionMiddleware } from "../middlewares/permissionMiddleware";
import { getAllCharacters } from "../controllers/CharacterController";
import { getEvents } from "../controllers/EventController";
import { getAllUsers } from "../controllers/UserController";

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
 *     description: Retrieves a list of all RPGs.
 *     tags:
 *       - Admin
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
 *     description: Retrieves a list of all Characters in the system.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: List of Characters retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/admin/characters', authMiddleware, getAllCharacters);

/**
 * @swagger
 * /admin/events:
 *   get:
 *     summary: Retrieves all events
 *     description: Returns a list of all events in the system.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: List of events retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/admin/events", authMiddleware, getEvents);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get a list of users
 *     description: Returns all registered users.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Successfully retrieved user list.
 */
router.get("/admin/users", authMiddleware, AdminPermissionMiddleware, getAllUsers);

/**
 * @swagger
 * /admin/events:
 *   get:
 *     summary: Retrieves all events
 *     description: Returns a list of all events in the system.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: List of events retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/admin/events", authMiddleware, getEvents);

export { router as adminRoutes };