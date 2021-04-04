import { Router } from 'express';
import {
  joinSessionController,
  loadSessionController,
  sessionInfoController,
  startSessionController
} from '@controllers/sessionController';

const sessionRoute = Router();

/* Join Session - "POST - api/session/join" */
sessionRoute.post('/join', joinSessionController);

/* Load Session - "GET - api/session/load/:sessionId" */
sessionRoute.get('/load/:sessionId', loadSessionController);

/* Start Session - "POST - api/session/start" */
sessionRoute.post('/start', startSessionController);

/* Get Session Info - "GET - api/session/info/:sessionId" */
sessionRoute.get('/info/:sessionId', sessionInfoController);

export default sessionRoute;
