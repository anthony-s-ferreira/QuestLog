import { Router } from "express";
import { createEvent, deleteEventById, getEventById, getEvents, updateEvent } from "../controllers/EventController";
import authMiddleware from "../middlewares/authMiddleware";
import { EventEditPermissionMiddleware } from "../middlewares/permissionMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Endpoints for managing events
 */

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Creates a new event
 *     description: Adds a new event to the system.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - characterId
 *               - typeId
 *             properties:
 *               description:
 *                 type: string
 *                 example: "A battle between warriors"
 *               characterId:
 *                 type: integer
 *                 example: 5
 *               typeId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Event created successfully.
 *       400:
 *         description: Invalid request data.
 */
router.post("/event", authMiddleware, createEvent);

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Retrieves an event by ID
 *     description: Returns the details of an event based on its ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Event retrieved successfully.
 *       404:
 *         description: Event not found.
 */
router.get("/event/:id", authMiddleware, EventEditPermissionMiddleware, getEventById);

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Updates an event by ID
 *     description: Modifies the details of an existing event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - characterId
 *               - eventTypeId
 *             properties:
 *               description:
 *                 type: string
 *                 example: "A changed event description"
 *               characterId:
 *                 type: integer
 *                 example: 3
 *               eventTypeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Event not found.
 */
router.put("/event/:id", authMiddleware, EventEditPermissionMiddleware, updateEvent);

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Deletes an event by ID
 *     description: Removes an event from the system based on its ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID.
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Event not found.
 */
router.delete("/event/:id", authMiddleware, EventEditPermissionMiddleware, deleteEventById);

export { router as eventRoutes };
