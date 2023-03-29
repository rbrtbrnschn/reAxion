import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MatchGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('match')
  handleMatch(client: any, payload: any): string {
    console.log(this.server, client);
    return 'Hello world!';
  }
}
