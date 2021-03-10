export interface WSMessage<T = never> {
  body: T;
  sessionId: string;
}
