import {
  GameManagerResponse,
  isSetExtraResponse,
  Observer,
  SetExtraPayloadTypes,
} from '@reaxion/core';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Countdown } from '../../components/countdown';
import { useGameManagerContext } from '../../contexts/game-manager.context';

export const Extra = () => {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(-2);
  const { gameManager } = useGameManagerContext();
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'extra Message Observer',
    update(eventName, response) {
      if (!isSetExtraResponse(response)) return;
      if (response.payload.data.type === SetExtraPayloadTypes.DEVIATION) {
        setMessage('Deviation: ' + response.payload.data.message);
      } else if (
        response.payload.data.type === SetExtraPayloadTypes.COUNTDOWN
      ) {
        setCount(() => response.payload.data.message as unknown as number);
      } else if (response.payload.data.type === SetExtraPayloadTypes.MESSAGE) {
        setMessage(response.payload.data.message);
      }
    },
  };

  useEffect(() => {
    gameManager.subscribe(observer);

    return () => {
      gameManager.unsubscribe(observer);
    };
  });

  const jsx = count > -1 ? <Countdown value={count} /> : message;
  return <ExtraDiv>{jsx}</ExtraDiv>;
};
const ExtraDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem; /* Optional: adjust font size as needed */
  margin-bottom: 1rem; /* Optional: add margin bottom to separate Extra from AnimationContent */
`;
