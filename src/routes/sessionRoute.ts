import { Router } from 'express';
import { joinSessionController, loadSessionController, startSessionController } from '@controllers/sessionController';

const sessionRoute = Router();

/* Join Session - "POST - api/session/join" */
sessionRoute.post('/join', joinSessionController);

/* Load Session - "GET - api/session/load/:sessionId" */
sessionRoute.get('/load/:sessionId', loadSessionController)

/* Start Session - "POST - api/session/start" */
sessionRoute.post('/start', startSessionController);

export default sessionRoute;
