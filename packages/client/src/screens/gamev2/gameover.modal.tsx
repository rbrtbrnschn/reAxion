import { RouteNames } from '@reaxion/common/enums';
import {
  GameManagerResponse,
  isFailGameResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import axios from 'axios';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { routes } from '../../routes';

export const GameOverModal = () => {
  const { gameManager, settingsManager } = useGameManagerContext();
  const [isShowing, setIsShowing] = useState(false);
  const [input, setInput] = useState(settingsManager.getUsername());
  const [formHasError, setFormHasError] = useState(false);
  const shouldAutoSave = useMemo(
    () => !!settingsManager.getUsername(),
    [settingsManager.getUsername()]
  );
  const navigate = useNavigate();
  const submitButton = useRef<HTMLButtonElement>(null);
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
    if (
      isShowing &&
      shouldAutoSave &&
      gameManager.getCurrentGame().score !== 0
    ) {
      setTimeout(() => {
        submitButton.current?.focus();
        setTimeout(() => {
          return submitButton.current?.click();
        }, 250);
      }, 250);
    }
    if (isShowing && gameManager.getCurrentGame().score === 0) {
      submitButton.current?.focus();
      setTimeout(() => {
        gameManager.dispatchResetGame();
        gameManager.dispatchGenerateNewWithRandomDuration();
        gameManager.dispatchStartingSequence();
      }, 500);
    }
  }, [isShowing]);

  useEffect(() => {
    gameManager.subscribe(observer);
    return () => {
      gameManager.unsubscribe(observer);
    };
  }, []);

  const onClick = () => {
    if (input.length !== 3) {
      setFormHasError(true);
      return;
    }
    gameManager.dispatchSetName(input);
    axios.post(
      (process.env.REACT_APP_API_URL || '') + '/api/game',
      gameManager.getCurrentGame()
    );
    gameManager.dispatchResetGame();
    navigate(routes[RouteNames.RECENT_STATS_PAGE].path);
    //gameManager.dispatchGenerateNewWithRandomDuration();
    //gameManager.dispatchStartingSequence();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (value.length === 3 && formHasError) setFormHasError(false);
    if (value.length > 3) return;
    setInput(value);
  };
  return isShowing ? (
    <div>
      <input
        type="checkbox"
        id="my-gameover-modal"
        className="modal-toggle"
        checked={isShowing}
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold text-lg">Game Over!</h3>
          <p className="py-4">
            You're score is: {gameManager.getCurrentGame().score}. Well done. To
            save your score, enter your name below.
          </p>
          <div className="modal-action ">
            <div className="form-control w-full">
              <form
                className="form-control"
                onSubmit={(e) => {
                  e.preventDefault();
                  onClick();
                }}
              >
                <label className="label">
                  <span
                    className={classNames({
                      'label-text': true,
                      'text-error': formHasError,
                    })}
                  >
                    {!formHasError
                      ? 'Enter name:'
                      : 'Name must have 3 characters!'}
                  </span>
                </label>
                <label className="input-group">
                  <input
                    type="text"
                    placeholder="XYZ"
                    className={classNames({
                      'input input-bordered w-full uppercase': true,
                      'input-error': formHasError,
                    })}
                    onChange={onChange}
                    value={input}
                  />
                  <button ref={submitButton} className="btn" onClick={onClick}>
                    Submit
                  </button>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};
