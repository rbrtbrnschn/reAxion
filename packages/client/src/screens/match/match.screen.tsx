import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';

interface Response<T> {
  data: T;
}
type MatchResponse = Response<{ [userId: string]: number }>;

const convertToScore = (response: MatchResponse, userId: string): number[] => {
  const sortedEntries = Object.entries(response.data).sort(([key1], [key2]) => {
    if (key1 === userId) return -1; // make userId the first entry
    if (key2 === userId) return 1; // make userId the second entry
    return 0; // otherwise, keep the order
  });

  const sortedData = Object.fromEntries(sortedEntries);
  return Object.values(sortedData);
};
const MyMatchScreen = () => {
  const { settingsManager } = useGameManagerContext();
  const { roomId } = useParams();
  const myUserId = settingsManager.getUserId();
  const [score, setScore] = useState<number[]>([]);
  const socketRef = useRef<Socket>();
  useEffect(() => {
    const _socket = io('http://localhost:8080');
    _socket.on('connect', function () {
      socketRef.current = _socket;
      console.log('Connected');

      _socket.on('match:ready', function (response: MatchResponse) {
        console.log('Match Begins');
        const newScore = convertToScore(response, myUserId);
        setScore([...newScore]);
      });

      _socket.on('match:increase-score', function (response: MatchResponse) {
        console.log('Match Increase Score');
        const newScore = convertToScore(response, myUserId);
        setScore([...newScore]);
      });

      _socket.emit(
        'match:join-room',
        { roomId: roomId, userId: settingsManager.getUserId() },
        (response: any) => {
          console.log('joined room');
        }
      );
    });

    _socket.on('disconnect', function () {
      _socket.emit('match:close-room', { roomId });
    });

    return () => {
      _socket.disconnect();
    };
  }, []);

  const handleCloseRoom = () => {
    socketRef.current?.emit('match:close-room', { roomId }, () => {
      console.log('closed room');
    });
  };
  const handleIncreaseScore = () => {
    console.log(socketRef.current);
    socketRef.current?.emit('match:increase-score', {
      roomId,
      userId: myUserId,
    });
  };
  return (
    <div>
      <button className="btn" onClick={handleCloseRoom}>
        Close Room
      </button>
      <button className="btn btn-primary" onClick={handleIncreaseScore}>
        Increase Score
      </button>
      <div className="prose">
        <h3>Score</h3>
        {score.map((s, index) => (
          <p key={index}>{s}</p>
        ))}
      </div>
    </div>
  );
};
export const MatchScreen = withNavigation(MyMatchScreen);
