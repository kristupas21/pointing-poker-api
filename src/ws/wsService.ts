import { io } from '../index';
import { createWSTopic } from '@shared-with-ui/functions';
import { WSBodySessionJoined, WSMessage } from '@shared-with-ui/types';
import { WS_EVENTS } from '@shared-with-ui/constants';
import SessionRepository from '@controllers/session/sessionRepository';

const sessionRepository = new SessionRepository();

class WsService {
    private getIo = () => io;

    private createTopic = createWSTopic;

    public static createMessage<T>(eventType: string, body: T): WSMessage<T> {
        return {
            eventType,
            body,
        }
    }

    public async sessionJoined (sessionId: string): Promise<void> {
        const topic = this.createTopic(sessionId);
        const session = await sessionRepository.getSessionById(sessionId);
        const message = WsService.createMessage<WSBodySessionJoined>
            (WS_EVENTS.SESSION_JOINED, { session });

        this.getIo().emit(topic, message)
    }
}

export default WsService;
