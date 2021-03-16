import { Response } from 'supertest';
import { IUser } from '../../src/controllers/User';


export interface IResponse extends Response {
  body: {
    users: IUser[];
    error: string;
  };
}

export interface IReqBody {
  user?: IUser;
}

