import { Router } from "express";

const router = Router();

router.post('/event')
router.put('/event/{id}')
router.delete('/event/{id}')
router.get('/event')
router.get('/event/{id}')

export { router as eventRoutes };
