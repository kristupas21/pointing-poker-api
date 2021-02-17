import StatusCodes from 'http-status-codes';
import { Response, Router } from 'express';
import { ERROR_CODES } from '@shared-with-ui/constants';
import { User } from '@shared-with-ui/types';
import { AppRequest } from '@global/types';
import { JoinSessionParams } from '../session/sessionModel';
import SessionService from '../session/sessionService';
import WsService from '../../ws/wsService';

const sessionController = Router();
const sessionService = new SessionService();
const wsService = new WsService();

/* Join Session - "POST - api/session/join" */
sessionController.post('/join', async (req: AppRequest<JoinSessionParams>, res: Response) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ERROR_CODES.MISSING_PARAM,
            param: 'sessionId',
        });
    }

    const session = await sessionService.joinSession(req.body);

    return res.status(StatusCodes.OK).json({ session });
});

/* Load Session - "GET - api/session/load/:sessionId" */
sessionController.get('/load/:sessionId', async (req: AppRequest, res: Response) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ERROR_CODES.MISSING_PARAM,
            param: 'sessionId',
        });
    }

    const session = await sessionService.loadSession(sessionId);

    if (!session) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: ERROR_CODES.NOT_FOUND,
        })
    }

    await wsService.sessionJoined(session.id);

    return res.status(StatusCodes.OK).json({ session });
})

/* Join Session - "POST - api/session/start" */
sessionController.post('/start', async (req: AppRequest<User>, res: Response) => {
    const { body: user } = req;

    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ERROR_CODES.MISSING_PARAM,
            param: 'user',
        });
    }

    const session = await sessionService.startSession(user);

    return res.status(StatusCodes.CREATED).json({ session });
});

export default sessionController;
