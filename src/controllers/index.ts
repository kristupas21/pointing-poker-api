import { Router } from 'express';
import Session from './Session';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/session', Session);

// Export the base-router
export default router;
