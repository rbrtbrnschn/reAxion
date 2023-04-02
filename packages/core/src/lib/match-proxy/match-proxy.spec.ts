/**
 * @jest-environment node
 */

import { v4 as uuid } from 'uuid';
import { MatchProxy } from './match-proxy';
import { MatchStatus } from './response.util';

describe('match mediator', () => {
  const mediators = Array.from({ length: 4 }).map(() => new MatchProxy());
  const [mediator, mediator2, mediator3, mediator4] = mediators;
  const userId1 = 'joe';
  const userId2 = 'pete';
  const [roomId1, roomId2] = Array.from({ length: 2 }).map(() => uuid());

  beforeAll(() => {
    mediators.forEach((m) => m.connect());
  });
  afterAll((done) => {
    mediators.forEach((m) => m.disconnect());
    done();
  });

  it('should join room and set status to ready if 2 join participants', async () => {
    const a = await mediator.joinRoom(roomId1, userId1);
    expect(a.status).toEqual(MatchStatus.WAITING);
    const b = await mediator2.joinRoom(roomId1, userId2);
    expect(b.status).toEqual(MatchStatus.READY);
    expect(Object.values(b.data).length).toEqual(2);
  });
  it('should leave room', async () => {
    const a = await mediator.leaveRoom();
    expect(a.status).toEqual(MatchStatus.LEFT_ROOM);
    const b = await mediator2.leaveRoom();
    expect(b.status).toEqual(MatchStatus.LEFT_ROOM);
  });
  it('should throw error if leaving room without having joined', async () => {
    await expect(mediator2.leaveRoom()).rejects.toThrowError();
    await expect(mediator.leaveRoom()).rejects.toThrowError();
  });

  it('should join room and not increase score if match is not of status ready', async () => {
    await mediator3.joinRoom(roomId2, userId1);
    const a = await mediator3.dispatchScoreIncrease();
    expect(a.status).toEqual(MatchStatus.NOT_READY);
  });

  it('should increase score if match is full', async () => {
    await mediator4.joinRoom(roomId2, userId2);
    const b = await mediator4.dispatchScoreIncrease();
    expect(b.status).toEqual(MatchStatus.INCREASE_SCORE);
    expect(b.data[userId2]).toEqual(1);
    expect(b.data[userId1]).toEqual(0);
  });

  it('should end game', async () => {
    const a = await mediator4.dispatchEnd();
    expect(a.status).toEqual(MatchStatus.END);
  });
});
