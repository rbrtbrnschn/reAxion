import {
  GameManagerResponse,
  isFailGameResponse,
  isReactionEndResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import classNames from 'classnames';
import { Heart } from 'heroicons-react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useGameManagerContext } from '../../contexts/game-manager.context';

export const GameInput = () => {
  const { gameManager } = useGameManagerContext();
  const [isDisabled, setIsDisabled] = useState(true);
  const [score, setScore] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lifes, setLifes] = useState<number>(0);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (score === 0) return;
    setShowScoreAnimation(() => true);
    setTimeout(() => {
      setShowScoreAnimation(() => false);
    }, 500);
  }, [score]);
  const scoreObserver: Observer<GameManagerResponse<unknown>> = {
    id: 'scoreObserver',
    update(eventName, response) {
      setScore(gameManager.getCurrentGame().getScore());
    },
  };
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'adsasd',
    update(eventName, response: GameManagerResponse<unknown>) {
      try {
        const newLifes = gameManager
          .getCurrentGame()
          .difficulty.getLifeCount(gameManager);
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
    gameManager.subscribe(scoreObserver);
    return () => {
      gameManager.unsubscribe(observer);
      gameManager.unsubscribe(scoreObserver);
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
          <div className="indicator">
            <span
              className={classNames({
                [`indicator-item indicator-top indicator-center badge badge-secondary `]:
                  true,
                'animate-ping': showScoreAnimation,
              })}
            >
              <div className="tooltip tooltip-secondary" data-tip="Score">
                {score}
              </div>
            </span>
            <span>
              {lifes}
              <MyHeartOutline />
            </span>
          </div>
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
