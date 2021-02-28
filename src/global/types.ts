import { Request } from 'express';

export type AppRequest<B = null, Q = never, P = never> = Request<P, any, B, Q>;
