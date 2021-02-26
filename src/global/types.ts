import { Request } from 'express';

export type AppRequest<T = null, Q = never> = Request<T, any, any, Q>;
