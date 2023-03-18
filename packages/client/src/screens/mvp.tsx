import { GuessStatus, ReactionStatus } from '@reaxion/common';
import {
  EasyDifficulty,
  Game,
  GameManager,
  GameManagerResponse,
  isReactionEndResponse,
  isReactionStartResponse,
  isStartingSequenceResponse,
  Observer,
  Reaction,
} from '@reaxion/core';
import { useEffect, useState } from 'react';
const gameManager = new GameManager();
export const Mvp = () => {
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'logger',
    update(eventName, response) {
      console.log(eventName);
    },
  };
  useEffect(() => {
    gameManager.setCurrentGame(
      new Game(new EasyDifficulty(), 0, 0, 'asdsad', [], [])
    );
    gameManager.setCurrentReaction(
      new Reaction(
        'asd',
        1000,
        [],
        false,
        GuessStatus.IS_WAITING,
        ReactionStatus.HAS_NOT_STARTED
      )
    );
    gameManager.subscribe(observer);

    gameManager.dispatchStartingSequence();

    return () => {
      gameManager.unsubscribe(observer);
    };
  }, []);
  return (
    <div>
      <div style={{ color: 'green' }}>MVP</div>
      <Count />
      <Animation />
      <Input />
    </div>
  );
};

const Count = () => {
  const [count, setCount] = useState(3);
  const countObserver: Observer<GameManagerResponse<unknown>> = {
    id: 'countObserver',
    update(eventName, response) {
      if (!isStartingSequenceResponse(response)) return;

      const timeout = setTimeout(() => {
        setCount(() => 2);
        setTimeout(() => {
          setCount(() => 1);
          setTimeout(() => {
            setCount(() => 0);
            gameManager.dispatchReactionStart();
          }, 1000);
        }, 1000);
      }, 1000);
    },
  };
  useEffect(() => {
    gameManager.subscribe(countObserver);
    return () => {
      gameManager.unsubscribe(countObserver);
    };
  }, []);
  return <div>{count > 0 && count}</div>;
};

const Animation = () => {
  const [color, setColor] = useState('bg-error');
  const baseStyles: React.CSSProperties = {
    width: '200px',
    height: '200px',
  };

  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'animationObserver',
    update(eventName, response) {
      if (isReactionStartResponse(response)) {
        setColor('bg-warning');
        setTimeout(() => {
          gameManager.dispatchReactionEnd();
        }, gameManager.getCurrentReaction().duration);
      } else if (isReactionEndResponse(response)) {
        setColor('bg-success');
      } else return;
    },
  };

  useEffect(() => {
    gameManager.subscribe(observer);
    return () => {
      gameManager.unsubscribe(observer);
    };
  }, []);

  return (
    <div style={{ ...baseStyles }} className={`${color} mask-squircle`}></div>
  );
};

const Input = () => {
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
    <form onSubmit={onSubmit}>
      <input className="input bg-slate-100" value={value} onChange={onChange} />
    </form>
  );
};
