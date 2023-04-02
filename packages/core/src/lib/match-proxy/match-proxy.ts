import { Socket } from 'socket.io';
import { io } from 'socket.io-client';
import { MatchGatewayResponse } from './response.util';
enum MatchEvent {
  JOIN_ROOM = 'match:join-room',
  LEAVE_ROOM = 'match:leave-room',
  READY = 'match:ready',
  INCREASE_SCORE = 'match:increase-score',
  END = 'match:end',
}
export class MatchProxy {
  private socket?: Socket;
  private roomId?: string;
  private userId?: string;

  public connect() {
    const connection = io('http://localhost:8080');
    this.socket = connection as unknown as Socket;
  }
  public disconnect() {
    if (!this.socket) throw new BadSocketError();
    this.socket.disconnect();
    delete this.socket;
  }
  public getSocket(): Socket {
    if (!this.socket) throw new BadSocketError();
    return this.socket;
  }

  async joinRoom(
    roomId: string,
    userId: string
  ): Promise<MatchGatewayResponse> {
    if (!roomId) throw new BadRoomIdError(roomId);
    if (!userId) throw new BadUserIdError(userId);
    if (!this.socket) throw new BadSocketError();
    const socket = this.socket;
    this.userId = userId;
    this.roomId = roomId;

    return new Promise((res) => {
      socket.emit(
        MatchEvent.JOIN_ROOM,
        { userId, roomId },
        (data: MatchGatewayResponse) => {
          return res(data);
        }
      );
    });
  }
  async leaveRoom(): Promise<MatchGatewayResponse> {
    if (!this.roomId) throw new BadRoomError(this.roomId);
    if (!this.userId) throw new BadUserIdError(this.userId);
    if (!this.socket) throw new BadSocketError();

    const socket = this.socket;
    return new Promise((res) => {
      socket.emit(
        MatchEvent.LEAVE_ROOM,
        { roomId: this.roomId },
        (data: MatchGatewayResponse) => {
          delete this.roomId;
          res(data);
        }
      );
    });
  }

  dispatchScoreIncrease(): Promise<MatchGatewayResponse> {
    if (!this.roomId) throw new BadRoomError(this.roomId);
    if (!this.userId) throw new BadUserIdError(this.userId);
    if (!this.socket) throw new BadSocketError();

    const socket = this.socket;
    return new Promise((res) => {
      socket.emit(
        MatchEvent.INCREASE_SCORE,
        { userId: this.userId, roomId: this.roomId },
        (data: MatchGatewayResponse) => {
          res(data);
        }
      );
    });
  }

  async dispatchEnd(): Promise<MatchGatewayResponse> {
    if (!this.roomId) throw new BadRoomError(this.roomId);
    if (!this.userId) throw new BadUserIdError(this.userId);
    if (!this.socket) throw new BadSocketError();

    const socket = this.socket;
    return new Promise((res) => {
      socket.emit(
        MatchEvent.END,
        { roomId: this.roomId },
        (data: MatchGatewayResponse) => {
          res(data);
        }
      );
    });
  }
}
class BadSocketError extends Error {
  constructor() {
    super('Socket failed to connect.');
  }
}
class BadRoomIdError extends Error {
  constructor(roomId: unknown) {
    super(`Bad roomId given: '${roomId}'`);
  }
}
class BadRoomError extends Error {
  constructor(roomId: unknown) {
    super(`Bad roomId given: '${roomId}'`);
  }
}
class BadUserIdError extends Error {
  constructor(userId: unknown) {
    super(`Bad userId given: '${userId}'`);
  }
}
