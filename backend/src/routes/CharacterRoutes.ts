import { Router } from "express";
import { createCharacter, getAllCharacters, getCharacterById, updateCharacter, deleteCharacter } from "../controllers/CharacterController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: Endpoints for managing Characters
 */

/**
 * @swagger
 * /character:
 *   post:
 *     summary: Create a new Character
 *     description: Adds a new Character to the system.
 *     tags:
 *       - Characters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - ownerId
 *               - rpgId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John the Brave"
 *               ownerId:
 *                 type: integer
 *                 example: 1
 *               rpgId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Character created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post('/character', createCharacter);

/**
 * @swagger
 * /character:
 *   get:
 *     summary: Get all Characters
 *     description: Retrieves a list of all Characters in the system.
 *     tags:
 *       - Characters
 *     responses:
 *       200:
 *         description: List of Characters retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/character', getAllCharacters);

/**
 * @swagger
 * /character/{id}:
 *   get:
 *     summary: Get a Character by ID
 *     description: Retrieves details of a specific Character by its ID.
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Character ID.
 *     responses:
 *       200:
 *         description: Character retrieved successfully.
 *       404:
 *         description: Character not found.
 */
router.get('/character/:id', getCharacterById);

/**
 * @swagger
 * /character/{id}:
 *   put:
 *     summary: Update a Character
 *     description: Updates the details of an existing Character by ID.
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Character ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John the Brave - Updated"
 *               rpgId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Character updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Character not found.
 */
router.put('/character/:id', updateCharacter);

/**
 * @swagger
 * /character/{id}:
 *   delete:
 *     summary: Delete a Character
 *     description: Removes a Character from the system by ID.
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Character ID.
 *     responses:
 *       200:
 *         description: Character deleted successfully.
 *       404:
 *         description: Character not found.
 */
router.delete('/character/:id', deleteCharacter);

export { router as characterRoutes };
