import {
  GameManagerResponse,
  isAddGuessResponse,
  isReactionEndResponse,
  isReactionStartResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import { useEffect, useState } from 'react';
import { Alert } from '../../components/alert';
import { useGameManagerContext } from '../../contexts/game-manager.context';

export const GameAlert = () => {
  const [message, setMessage] = useState('Get Ready.');
  const { gameManager } = useGameManagerContext();

  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'a',
    update: (eventName, response) => {
      if (isAddGuessResponse(response)) {
        if (response.payload.data.status === 'GUESS_INVALID_HIGH') {
          setMessage('Too high.');
        } else if (response.payload.data.status === 'GUESS_INVALID_LOW') {
          setMessage('Too low.');
        }
      } else if (isStartingSequenceResponse(response)) {
        setMessage('Get Ready.');
      } else if (isReactionStartResponse(response)) {
        setMessage('In progress.');
      } else if (isReactionEndResponse(response)) {
        setMessage('Waiting for guess.');
      }
    },
  };

  useEffect(() => {
    gameManager.subscribe(observer);
    return () => {
      gameManager.unsubscribe(observer);
    };
  }, []);

  if (!message) return <></>;

  return <Alert message={message} />;
};
