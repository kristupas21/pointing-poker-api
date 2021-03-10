import './pre-start'; // Must be the first import
import app from '@server';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import logger from '@global/Logger';
import WsService from '@services/wsService';

void mongoose.connect('mongodb://localhost/pp',
  { useNewUrlParser: true, useUnifiedTopology: true });

export const MongooseConnection = mongoose.connection;

MongooseConnection.on('error', (error) => console.error(error));
MongooseConnection.once('open', () => console.log('open DB'));

const port = Number(process.env.PORT || 9000);

const server = app.listen(port, () => {
  logger.info(`Express server started on port: ${port}`);
});

export const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket: Socket) => {
  const { sessionId, userId } = socket.handshake.auth;

  if (!sessionId) {
    throw new Error('No sessionId');
  }

  const wsService = new WsService(socket, sessionId);

  wsService.init();

  socket.on('disconnect', async () => {
    await wsService.destroy(userId);
  })
})
