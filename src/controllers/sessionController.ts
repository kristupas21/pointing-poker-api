import { AppRequest } from '@global/types';
import {
  JoinSessionBody,
  LoadSessionParams,
  LoadSessionQuery,
  SessionInfoParams,
  StartSessionBody
} from '@models/sessionModel';
import { Response } from 'express';
import StatusCodes from 'http-status-codes';
import { ERROR_CODES } from '@shared-with-ui/constants';
import SessionService from '@services/sessionService';

const sessionService = new SessionService();

export const joinSessionController = async (req: AppRequest<JoinSessionBody>, res: Response) => {
  const { sessionId } = req.body;


  if (!sessionId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: ERROR_CODES.MISSING_PARAM,
      payload: 'sessionId',
    });
  }

  try {
    const user = await sessionService.joinSession(req.body);
    return res.status(StatusCodes.OK).json({ user, sessionId });
  } catch (e) {
    const status = e?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const error = e?.code ? { code: e.code, payload: e.payload } : e;

    return res.status(status).json(error)
  }
}

export const loadSessionController = async (req: AppRequest<null, LoadSessionQuery, LoadSessionParams>, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.query.userId;

  if (!sessionId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: ERROR_CODES.MISSING_PARAM,
      payload: 'sessionId',
    });
  }

  try {
    const session = await sessionService.loadSession(sessionId, userId);

    if (!session) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: ERROR_CODES.SESSION_NOT_FOUND,
        payload: sessionId,
      });
    }

    return res.status(StatusCodes.OK).json({ session });
  } catch (e) {
    const status = e?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const error = e?.code ? { code: e.code } : e;

    return res.status(status).json(error)
  }
}

export const startSessionController = async (req: AppRequest<StartSessionBody>, res: Response) => {
  if (!req.body.user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: ERROR_CODES.MISSING_PARAM,
      payload: 'user',
    });
  }

  try {
    const response = await sessionService.startSession(req.body);
    return res.status(StatusCodes.CREATED).json({ ...response });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: ERROR_CODES.INTERNAL_SERVER, error: e,
    });
  }
}

export const sessionInfoController = async (req: AppRequest<null, null, SessionInfoParams>, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: ERROR_CODES.MISSING_PARAM,
      payload: 'sessionId',
    });
  }

  try {
    const session = await sessionService.getSessionInfo(sessionId);
    return res.status(StatusCodes.OK).json({ session });
  } catch (e) {
    const status = e?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const error = e?.code ? { code: e.code } : e;

    return res.status(status).json(error)
  }
}
