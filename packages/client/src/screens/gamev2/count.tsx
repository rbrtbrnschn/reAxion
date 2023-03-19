import {
  GameManagerResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import { useEffect, useState } from 'react';
import { Countdown } from '../../components/countdown';
import { useGameManagerContext } from '../../contexts/game-manager.context';

export const GameCount = () => {
  const { gameManager } = useGameManagerContext();
  const [count, setCount] = useState(-1);
  const countObserver: Observer<GameManagerResponse<unknown>> = {
    id: 'countObserver',
    update(eventName, response) {
      if (isStartingSequenceResponse(response)) {
        setCount(() => 3);
        const timeout = setTimeout(() => {
          setCount(() => 2);
          setTimeout(() => {
            setCount(() => 1);
            setTimeout(() => {
              setCount(() => 0);
              setTimeout(() => {
                setCount(() => -1);
                gameManager.dispatchReactionStart();
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }
    },
  };
  useEffect(() => {
    gameManager.subscribe(countObserver);
    return () => {
      gameManager.unsubscribe(countObserver);
    };
  }, []);
  return count > -1 ? <Countdown value={count} /> : <></>;
};
