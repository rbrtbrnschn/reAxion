import {
  GameManagerResponse,
  isFailGameResponse,
  isReactionEndResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import { Heart } from 'heroicons-react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useGameManagerContext } from '../../contexts/game-manager.context';

export const GameInput = () => {
  const { gameManager } = useGameManagerContext();
  const [isDisabled, setIsDisabled] = useState(true);
  const [lifes, setLifes] = useState<number>(0);
  const ref = useRef<HTMLInputElement>(null);
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'adsasd',
    update(eventName, response: GameManagerResponse<unknown>) {
      try {
        const newLifes =
          gameManager.getCurrentGame().difficulty.maxFailedAttempts -
          gameManager.getCurrentGame().getFailedAttempts();
        setLifes(newLifes);
      } catch (e) {}
      if (isFailGameResponse(response)) {
        setIsDisabled(true);
      } else if (isStartingSequenceResponse(response)) {
        setIsDisabled(true);
      } else if (isReactionEndResponse(response)) {
        setIsDisabled(false);
      }
    },
  };

  useEffect(() => {
    gameManager.subscribe(observer);
    return () => {
      gameManager.unsubscribe(observer);
    };
  }, []);

  useEffect(() => {
    if (!isDisabled) ref.current?.focus();
  }, [isDisabled]);

  const [value, setValue] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIsNaN = isNaN(parseInt(value));
    if (parsedIsNaN) return;

    gameManager.dispatchAddGuess(parseInt(value));
    setValue('');
  };
  const getLifes = () => {
    try {
      return (
        gameManager.getCurrentGame().difficulty.maxFailedAttempts -
        gameManager.getCurrentGame().getFailedAttempts()
      );
    } catch (e) {
      return 0;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="w-full"
    >
      <div className="form-control">
        <div className="input-group">
          <input
            type="number"
            placeholder="Input your guess in ms..."
            className="input input-bordered w-full "
            ref={ref}
            onChange={onChange}
            value={value}
          />
          <span>
            {getLifes()}
            <MyHeartOutline />
          </span>
        </div>
      </div>
    </form>
  );
};

const MyHeartOutline = styled(Heart)`
  & {
    width: 22px;
    height: 22px;
  }
`;
