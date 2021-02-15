import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import { paramMissingError } from '@shared/constants';
import SessionDao from './SessionDao';
import { AppRequest, User } from '@shared/types';
import { SessionJoinREQ } from '@controllers/Session/SessionTypes';

const router = Router();
const sessionDao = new SessionDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/******************************************************************************
 *                      Join Session - "GET /api/session/join"
 ******************************************************************************/

router.post('/join', async (req: AppRequest<SessionJoinREQ>, res: Response) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    const session = await sessionDao.join(req.body)

    return res.status(OK).json({ session });
});

/******************************************************************************
 *                      Get Session - "GET /api/session/:sessionId"
 ******************************************************************************/


router.get('/load/:sessionId', async (req: AppRequest, res: Response) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    const session = await sessionDao.get(sessionId)

    return res.status(OK).json({ session });
})

/******************************************************************************
 *                      Start Session - "GET /api/session/start"
 ******************************************************************************/

router.post('/start', async (req: AppRequest<User>, res: Response) => {
    const { body: user } = req;

    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    const session = await sessionDao.start(user)

    return res.status(CREATED).json({ session });
});

export default router;
