import { Router } from "express";
import { createRPG, deleteRPG, getAllRPGs, getRPGById, updateRPG, updateRPGStatus } from "../controllers/RpgController";

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
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fantasy Quest"
 *               description:
 *                 type: string
 *                 example: "An epic adventure in a magical world."
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: RPG created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post('/rpg', createRPG);

/**
 * @swagger
 * /rpg:
 *   get:
 *     summary: Get all RPGs
 *     description: Retrieves a list of all RPGs.
 *     tags:
 *       - RPGs
 *     responses:
 *       200:
 *         description: List of RPGs retrieved successfully.
 */
router.get('/rpg', getAllRPGs);

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
router.get('/rpg/:id', getRPGById);

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
router.put('/rpg/:id', updateRPG);

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
router.patch('/rpg/:id', updateRPGStatus);

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
router.delete('/rpg/:id', deleteRPG);

export { router as rpgRoutes };