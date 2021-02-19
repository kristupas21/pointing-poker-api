import './pre-start'; // Must be the first import
import app from '@server';
import logger from './global/Logger';
import { Server, Socket } from 'socket.io';
import WsService from './ws/wsService';

const port = Number(process.env.PORT || 9000);

const server = app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

export const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket: Socket) => {
    const sessionId: string = socket.handshake.auth.sessionId;

    if (!sessionId) {
        throw new Error('No sessionId');
    }

    const wsService = new WsService(socket, sessionId);

    wsService.init();

    socket.on('disconnect', () => {
        wsService.destroy();
    })
})
