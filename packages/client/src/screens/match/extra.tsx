import { MatchEvent, MatchGatewayResponse } from '@reaxion/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameManagerContext } from '../../contexts/game-manager.context';

const convertToScore = (
  response: MatchGatewayResponse,
  userId: string
): number[] => {
  const sortedEntries = Object.entries(response.data).sort(([key1], [key2]) => {
    if (key1 === userId) return -1; // make userId the first entry
    if (key2 === userId) return 1; // make userId the second entry
    return 0; // otherwise, keep the order
  });

  const sortedData = Object.fromEntries(sortedEntries);
  return Object.values(sortedData);
};

export const Extra = () => {
  const { roomId } = useParams();
  const { gameManager, settingsManager } = useGameManagerContext();
  const [score, setScore] = useState<number[]>([]);
  const [text, setText] = useState('');
  const myUserId = settingsManager.getUserId();

  useEffect(() => {
    gameManager.matchProxy.connect();
    const socket = gameManager.matchProxy.getSocket();
    socket.on('connect', function () {
      console.log('Connected');

      socket.on(MatchEvent.READY, function (response: MatchGatewayResponse) {
        console.log('Match Begins');
        const newScore = convertToScore(response, myUserId);
        setScore([...newScore]);
      });

      socket.on(
        MatchEvent.INCREASE_SCORE,
        function (response: MatchGatewayResponse) {
          console.log('Match Increase Score');
          const newScore = convertToScore(response, myUserId);
          console.log(response.data, newScore);
          setScore([...newScore]);
        }
      );

      socket.on(MatchEvent.END, function (response: MatchGatewayResponse) {
        console.log('game ended');
        setScore([]);
        setText('Game Over.');
      });

      socket.on(
        MatchEvent.LEAVE_ROOM,
        function (response: MatchGatewayResponse) {
          console.log('left room');
        }
      );

      gameManager.matchProxy.joinRoom(
        roomId as string,
        settingsManager.getUserId()
      );
    });

    return () => {
      socket.emit(MatchEvent.LEAVE_ROOM, { roomId: roomId });
      //gameManager.matchProxy.leaveRoom();
      gameManager.matchProxy.disconnect();
    };
  }, []);

  return (
    <div>
      {score.every((v) => v === 0) && text ? <span>{text}</span> : <></>}
      {score.map((v, i) => (
        <span key={i}>{v}</span>
      ))}
    </div>
  );
};
