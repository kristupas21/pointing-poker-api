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
