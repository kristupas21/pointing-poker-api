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

    try {
        const user = await sessionService.joinSession(req.body);
        return res.status(StatusCodes.OK).json({ user, sessionId });
    } catch (e) {
        const status = e?.status || StatusCodes.INTERNAL_SERVER_ERROR;
        const error = e?.code ? { error: e.code } : e;

        return res.status(status).json(error)
    }
});

/* Load Session - "GET - api/session/load/:sessionId" */
sessionController.get('/load/:sessionId',
    async (req: AppRequest<{ sessionId: string }, { userId: string }>, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.query.userId;

    if (!sessionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ERROR_CODES.MISSING_PARAM,
            param: 'sessionId',
        });
    }

    try {
        const session = await sessionService.loadSession(sessionId, userId);

        if (!session) {
            return res.status(StatusCodes.NOT_FOUND).json({
                sessionId, error: ERROR_CODES.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({ session });
    } catch (e) {
        const status = e?.status || StatusCodes.INTERNAL_SERVER_ERROR;
        const error = e?.code ? { error: e.code } : e;

        return res.status(status).json(error)
    }
})

/* Start Session - "POST - api/session/start" */
sessionController.post('/start',
    async (req: AppRequest<{ user: UserSchema, useRoles: boolean }>, res: Response) => {
    const { user, useRoles } = req.body;

    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ERROR_CODES.MISSING_PARAM,
            param: 'user',
        });
    }

    const sessionId = await sessionService.startSession(user, useRoles);

    if (!sessionId) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: ERROR_CODES.INTERNAL_SERVER,
        });
    }

    return res.status(StatusCodes.CREATED).json({ sessionId });
});

export default sessionController;
