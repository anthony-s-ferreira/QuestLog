import { Router } from "express";
import { createRPG, deleteRPG, getAllRPGs, getRPGById, getRPGEvents, getRPGsByUserId, updateRPG, updateRPGStatus } from "../controllers/RpgController";
import authMiddleware from '../middlewares/authMiddleware';
import { RPGEditPermissionMiddleware, RPGPermissionMiddleware } from "../middlewares/permissionMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: RPGs
 *   description: Endpoints for managing RPGs
 */

/**
 * @swagger
 * /rpg:
 *   post:
 *     summary: Create a new RPG
 *     description: Adds a new RPG to the system.
 *     tags:
 *       - RPGs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fantasy Quest"
 *               description:
 *                 type: string
 *                 example: "An epic adventure in a magical world."
 *     responses:
 *       201:
 *         description: RPG created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post('/rpg', authMiddleware, createRPG);

/**
 * @swagger
 * /rpgs:
 *   get:
 *     summary: Get all RPGs
 *     description: Retrieves a list of all RPGs.
 *     tags:
 *       - RPGs
 *     responses:
 *       200:
 *         description: List of RPGs retrieved successfully.
 */
router.get('/rpgs', authMiddleware, getRPGsByUserId);

/**
 * @swagger
 * /rpg/{id}/events:
 *   get:
 *     summary: Get all events for an RPG
 *     description: Retrieves a list of all events for a specific RPG with pagination.
 *     tags:
 *       - RPGs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The RPG ID
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
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: RPG not found.
 */
router.get('/rpg/:id/events', authMiddleware, RPGPermissionMiddleware, getRPGEvents);

/**
 * @swagger
 * /rpg/{id}:
 *   get:
 *     summary: Get an RPG by ID
 *     description: Retrieves details of a specific RPG by its ID.
 *     tags:
 *       - RPGs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The RPG ID
 *     responses:
 *       200:
 *         description: RPG retrieved successfully.
 *       404:
 *         description: RPG not found.
 */
router.get('/rpg/:id', authMiddleware, RPGPermissionMiddleware, getRPGById);

/**
 * @swagger
 * /rpg/{id}:
 *   put:
 *     summary: Update an RPG
 *     description: Updates the details of an existing RPG.
 *     tags:
 *       - RPGs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The RPG ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Fantasy Quest"
 *               description:
 *                 type: string
 *                 example: "A new chapter in the magical adventure."
 *     responses:
 *       200:
 *         description: RPG updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: RPG not found.
 */
router.put('/rpg/:id', authMiddleware, RPGEditPermissionMiddleware, updateRPG);

/**
 * @swagger
 * /rpg/{id}:
 *   patch:
 *     summary: Update RPG status
 *     description: Updates the status of an existing RPG.
 *     tags:
 *       - RPGs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The RPG ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: RPG status updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: RPG not found.
 */
router.patch('/rpg/:id', authMiddleware, RPGEditPermissionMiddleware, updateRPGStatus);

/**
 * @swagger
 * /rpg/{id}:
 *   delete:
 *     summary: Delete an RPG
 *     description: Removes an RPG from the system.
 *     tags:
 *       - RPGs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The RPG ID
 *     responses:
 *       200:
 *         description: RPG deleted successfully.
 *       404:
 *         description: RPG not found.
 */
router.delete('/rpg/:id', authMiddleware, RPGEditPermissionMiddleware, deleteRPG);

export { router as rpgRoutes };