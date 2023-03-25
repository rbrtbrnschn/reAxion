import {
  EasyDifficulty,
  Game,
  GameManager,
  GameManagerResponse,
  GuessStatus,
  isCompleteReactionResponse,
  isFailGameResponse,
  isReactionEndResponse,
  isReactionStartResponse,
  isStartingSequenceResponse,
  Observer,
  Reaction,
  ReactionStatus,
} from '@reaxion/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid4 } from 'uuid';
import { Countdown } from '../components/countdown';
const gameManager = new GameManager();
export const Mvp = () => {
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'logger',
    update(eventName, response) {
      console.log(eventName);

      if (isCompleteReactionResponse(response)) {
        gameManager.dispatchGenerateNewWithRandomDuration();
        gameManager.dispatchStartingSequence();
      }
    },
  };
  useEffect(() => {
    gameManager.setCurrentGame(
      new Game('', new EasyDifficulty(), 0, 0, uuid4(), [], [])
    );
    gameManager.setCurrentReaction(
      new Reaction(
        uuid4(),
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
      <GameOverModal />
    </div>
  );
};

const Count = () => {
  const [count, setCount] = useState(0);
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
              gameManager.dispatchReactionStart();
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
  return <div>{count > 0 && <Countdown value={count} />}</div>;
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
      if (isStartingSequenceResponse(response)) {
        setColor('bg-error');
      } else if (isReactionStartResponse(response)) {
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
  const [isDisabled, setIsDisabled] = useState(true);
  const ref = useRef<HTMLInputElement>(null);
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'adsasd',
    update(eventName, response) {
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
  return (
    <form onSubmit={onSubmit}>
      <input
        ref={ref}
        disabled={isDisabled}
        className={`input bg-slate-100 ${isDisabled && 'input-disabled'}`}
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

const GameOverModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [input, setInput] = useState('');
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'asdasd',
    update(eventName, response) {
      if (isFailGameResponse(response)) {
        setIsShowing(true);
      } else if (isStartingSequenceResponse(response)) {
        setIsShowing(false);
      }
    },
  };

  useEffect(() => {
    gameManager.subscribe(observer);
    return () => {
      gameManager.unsubscribe(observer);
    };
  }, []);

  const onClick = () => {
    gameManager.dispatchSetName(input);
    axios.post('/api/game', gameManager.getCurrentGame());
    gameManager.dispatchResetGame();
    gameManager.dispatchGenerateNewWithRandomDuration();
    gameManager.dispatchStartingSequence();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 3) return;
    setInput(e.currentTarget.value);
  };
  return isShowing ? (
    <div className="prose">
      <h1>Game over{gameManager.getCurrentGame().getScore()}</h1>
      <input value={input} className="input bg-slate-200" onChange={onChange} />
      <h3>Start a new?</h3>
      <button className="btn" onClick={onClick} disabled={input.length !== 3}>
        Click Here!
      </button>
    </div>
  ) : (
    <div></div>
  );
};
