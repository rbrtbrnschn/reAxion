import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import {
  MatchEvent,
  MatchGatewayResponse,
  MatchState,
  MatchStatus,
} from '@reaxion/core';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MatchGateway {
  @WebSocketServer()
  server: Server;
  matches: Map<string, MatchState> = new Map();

  @SubscribeMessage(MatchEvent.JOIN_ROOM)
  openRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('userId') userId: string,
    @MessageBody('roomId') roomId: string
  ): MatchGatewayResponse {
    console.log('hit endpoint:', userId, roomId);
    const room = this.server.sockets.adapter.rooms.get(roomId);
    const connections = room ? room.size : 0;
    if (connections >= 2) return;

    socket.join(roomId);
    const match = this.matches.get(roomId) || {};
    match[userId] = 0;
    this.matches.set(roomId, match);
    if (connections === 1) {
      socket.emit(MatchEvent.READY, {
        data: match,
      });
      socket.to(roomId).emit(MatchEvent.READY, {
        data: match,
      });
      return new MatchGatewayResponse(MatchStatus.READY, match);
    }
    return new MatchGatewayResponse(MatchStatus.WAITING, match);
  }

  @SubscribeMessage(MatchEvent.INCREASE_SCORE)
  increaseScore(
    @ConnectedSocket() socket: Socket,
    @MessageBody('userId') userId: string,
    @MessageBody('roomId') roomId: string
  ): MatchGatewayResponse {
    const match = this.matches.get(roomId);
    if (!match) return new MatchGatewayResponse(MatchStatus.NO_ROOM_FOUND, {});
    if (Object.values(match).length !== 2)
      return new MatchGatewayResponse(MatchStatus.NOT_READY, {});

    match[userId] += 1;
    socket.to(roomId).emit(MatchEvent.INCREASE_SCORE, {
      data: match,
    });
    socket.emit(MatchEvent.INCREASE_SCORE, { data: match });
    return new MatchGatewayResponse(MatchStatus.INCREASE_SCORE, match);
  }

  @SubscribeMessage(MatchEvent.END)
  endMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody('userId') userId: string,
    @MessageBody('roomId') roomId: string
  ): MatchGatewayResponse {
    const match = this.matches.get(roomId);
    if (!match) return new MatchGatewayResponse(MatchStatus.NO_ROOM_FOUND, {});

    socket.emit(MatchEvent.END, { data: match });
    socket.to(roomId).emit(MatchEvent.END, {
      data: match,
    });

    this.matches.delete(roomId);
    return new MatchGatewayResponse(MatchStatus.END, match);
  }

  @SubscribeMessage(MatchEvent.LEAVE_ROOM)
  closeRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('roomId') roomId: string
  ) {
    socket.to(roomId).emit(MatchEvent.LEAVE_ROOM, {
      data: {},
    });
    socket.emit(MatchEvent.LEAVE_ROOM, { data: {} });
    socket.leave(roomId);
    return new MatchGatewayResponse(MatchStatus.LEFT_ROOM, {});
  }
}

class NoRoomFoundException extends WsException {
  constructor(roomId) {
    super({ code: 403, message: 'No Room Found', roomId });
  }
}

class MatchNotReadyException extends Error {
  constructor(roomId) {
    super(`Match '${roomId}' Not Ready.`);
  }
}
