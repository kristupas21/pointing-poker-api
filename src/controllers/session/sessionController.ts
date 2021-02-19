import StatusCodes from 'http-status-codes';
import { Response, Router } from 'express';
import { ERROR_CODES } from '@shared-with-ui/constants';
import { AppRequest } from '@global/types';
import { JoinSessionParams } from '../session/sessionModel';
import SessionService from '../session/sessionService';
import { UserSchema } from '@controllers/user/userSchema';

const sessionController = Router();
const sessionService = new SessionService();

/* Join Session - "POST - api/session/join" */
sessionController.post('/join', async (req: AppRequest<JoinSessionParams>, res: Response) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ERROR_CODES.MISSING_PARAM,
            param: 'sessionId',
        });
    }

    const user = await sessionService.joinSession(req.body);

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            sessionId, error: ERROR_CODES.NOT_FOUND
        });
    }

    return res.status(StatusCodes.OK).json({ user, sessionId });

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
            sessionId, error: ERROR_CODES.NOT_FOUND
        });
    }

    return res.status(StatusCodes.OK).json({ session });
})

/* Start Session - "POST - api/session/start" */
sessionController.post('/start', async (req: AppRequest<UserSchema>, res: Response) => {
    const { body: user } = req;

    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ERROR_CODES.MISSING_PARAM,
            param: 'user',
        });
    }

    const sessionId = await sessionService.startSession(user);

    if (!sessionId) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: ERROR_CODES.INTERNAL_SERVER,
        });
    }

    return res.status(StatusCodes.CREATED).json({ sessionId });
});

export default sessionController;
