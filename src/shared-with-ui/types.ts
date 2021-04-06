import { UserSchemaProps } from '@schemas/userSchema';

export enum AvatarId {
  Demo1 = 'demo-1',
  Demo2 = 'demo-2',
  Demo3 = 'demo-3',
  Demo4 = 'demo-4',
}

export interface PointValue {
  id: string;
  pos: number;
  value: string;
}

export type ValueOf<T> = T[keyof T];

export type Primitive = string | boolean | number;

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export interface WSMessage<T extends object = {}> {
  body: T;
  sessionId: string;
}

export type WSMessageUserData = WSMessage<{ user: UserSchemaProps }>;
export type WSMessageSetVoteValue = WSMessage<{ user: UserSchemaProps; voteValue: string }>;
export type WSMessageSetTopic = WSMessage<{ topic: string }>;
export type WSMessageModifyUser = WSMessage<{ params: Partial<UserSchemaProps>; userId: string }>;
export type WSMessageSessionPermissions = WSMessage<{ usePermissions: boolean }>;
export type WSMessageUserPermissions = WSMessage<{ hasPermission: boolean }>;
