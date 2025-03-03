import { Router } from "express";
import { createEventType, deleteEventTypeById, getEventTypeById, getEventTypes, updateEventType } from "../controllers/EventTypeController";
import authMiddleware from "../middlewares/authMiddleware";
import { AdminPermissionMiddleware } from "../middlewares/permissionMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Event Types
 *   description: API endpoints for managing event types
 */

/**
 * @swagger
 * /eventType:
 *   post:
 *     summary: Create a new event type
 *     description: Adds a new event type to the system.
 *     tags: [Event Types]
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
 *                 example: "Combat"
 *               description:
 *                 type: string
 *                 example: "An intense battle scene"
 *     responses:
 *       201:
 *         description: Event type created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post('/eventType', authMiddleware, AdminPermissionMiddleware, createEventType);

/**
 * @swagger
 * /eventType:
 *   get:
 *     summary: Retrieve all event types
 *     description: Fetches a list of all available event types.
 *     tags: [Event Types]
 *     responses:
 *       200:
 *         description: List of event types retrieved successfully.
 */
router.get('/eventType', authMiddleware, getEventTypes);

/**
 * @swagger
 * /eventType/{id}:
 *   get:
 *     summary: Get an event type by ID
 *     description: Retrieves details of a specific event type by its ID.
 *     tags: [Event Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Event type retrieved successfully.
 *       404:
 *         description: Event type not found.
 */
router.get('/eventType/:id', authMiddleware, getEventTypeById);

/**
 * @swagger
 * /eventType/{id}:
 *   put:
 *     summary: Update an event type
 *     description: Updates the details of an existing event type by ID.
 *     tags: [Event Types]
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
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Investigation"
 *               description:
 *                 type: string
 *                 example: "A deep dive into mystery-solving."
 *     responses:
 *       200:
 *         description: Event type updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Event type not found.
 */
router.put('/eventType/:id', authMiddleware, AdminPermissionMiddleware, updateEventType);

/**
 * @swagger
 * /eventType/{id}:
 *   delete:
 *     summary: Delete an event type
 *     description: Removes an event type from the system by ID.
 *     tags: [Event Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event type deleted successfully.
 *       404:
 *         description: Event type not found.
 */
router.delete('/eventType/:id', authMiddleware, AdminPermissionMiddleware, deleteEventTypeById);

export { router as eventTypeRoutes };
