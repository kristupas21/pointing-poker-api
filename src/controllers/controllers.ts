import { Router } from 'express';
import sessionController from './/session/sessionController';

const router = Router();

router.use('/session', sessionController);

export default router;
