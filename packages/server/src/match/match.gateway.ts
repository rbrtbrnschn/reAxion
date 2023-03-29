import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface State {
  [userId: string]: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MatchGateway {
  @WebSocketServer()
  server: Server;
  matches: Map<string, State> = new Map();

  @SubscribeMessage('match:join-room')
  openRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('userId') userId: string,
    @MessageBody('roomId') roomId: string
  ): string {
    const room = this.server.sockets.adapter.rooms.get(roomId);
    const connections = room ? room.size : 0;
    if (connections >= 2) return;

    socket.join(roomId);
    const match = this.matches.get(roomId);
    if (!match) this.matches.set(roomId, { [userId]: 0 });
    if (match) this.matches.set(roomId, { ...match, [userId]: 0 });
    if (connections === 1) {
      socket.emit('match:ready', {
        data: match,
      });
      socket.to(roomId).emit('match:ready', {
        data: match,
      });
      return MatchStatus.READY;
    }
    return MatchStatus.WAITING;
  }

  @SubscribeMessage('match:increase-score')
  increaseScore(
    @ConnectedSocket() socket: Socket,
    @MessageBody('userId') userId: string,
    @MessageBody('roomId') roomId: string
  ): string {
    const match = this.matches.get(roomId);
    if (!match) throw new Error('No Room Found.');

    match[userId] += 1;
    socket.to(roomId).emit('match:increase-score', {
      data: match,
    });
    socket.emit('match:increase-score', { data: match });
    return MatchStatus.INCREASE_SCORE;
  }

  @SubscribeMessage('match:close-room')
  closeRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('roomId') roomId: string
  ) {
    socket.leave(roomId);
    return 'a';
  }
}

enum MatchStatus {
  WAITING = 'WAITING',
  READY = 'READY',
  INCREASE_SCORE = 'INCREASE_SCORE',
}
