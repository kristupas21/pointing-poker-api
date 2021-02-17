import { Request } from 'express';

export interface AppRequest<T = null> extends Request {
    body: T;
}
