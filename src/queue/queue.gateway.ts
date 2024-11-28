import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QueueGateway {
  @WebSocketServer() server: Server;

  // MANGGIL ANTRIAN ADMISI
  async emitPanggilAntrianAdmisi(antrian: string, message: string) {
    try {
      this.server.emit('panggilAntrianAdmisi', { antrian, message });
    } catch (error) {
      console.error('Error emitting event', error);
    }
  }

  // DI TAMPILAN PENDAFTARAN->NOMOR ANTRIAN
  async emitDataAntrianAdmisi(antrian: any) {
    try {
      this.server.emit('dataAntrianAdmisi', { antrian });
    } catch (error) {
      console.error('Error emitting event', error);
    }
  }
  // MANGGIL ANTRIAN PASIEN
  async emitPanggilAntrianPasien(
    antrian: string,
    message: string,
    poli: string,
  ) {
    try {
      this.server.emit('panggilAntrianPasien', { antrian, message, poli });
    } catch (error) {
      console.error('Error emitting event', error);
    }
  }
  // DI TAMPILAN PERAWAT
  async emitDataAntrianPasien(antrian: any) {
    try {
      this.server.emit('dataAntrianPasien', { antrian });
    } catch (error) {
      console.error('Error emitting event', error);
    }
  }
}
