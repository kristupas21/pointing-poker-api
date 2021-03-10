import { Router } from 'express';
import sessionRoute from '@routes/sessionRoute';

const router = Router();

router.use('/session', sessionRoute);

export default router;
