import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QueueGateway {
  @WebSocketServer() server: Server;

  // Emit event to notify clients about the last Antrian
  async emitLastAntrian(antrian: string, message: string) {
    try {
      this.server.emit('lastAntrianUpdated', { antrian, message });
    } catch (error) {
      console.error('Error emitting event', error);
    }
  }

  async emitLastAntrianAdmisi(antrian: any) {
    try {
      this.server.emit('lastAntrianAdmisiUpdated', { antrian });
    } catch (error) {
      console.error('Error emitting event', error);
    }
  }
}
