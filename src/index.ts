import './pre-start'; // Must be the first import
import app from '@server';
import logger from './global/Logger';
import { Server } from 'socket.io';

// Start the server
const port = Number(process.env.PORT || 9000);
const server = app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

export const io = new Server(server, { cors: { origin: '*' } });
