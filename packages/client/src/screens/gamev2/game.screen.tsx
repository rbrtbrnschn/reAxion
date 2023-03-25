import {
  GameManagerResponse,
  GameService,
  isCompleteReactionResponse,
  isReactionEndResponse,
  isReactionStartResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { loggerService } from '../../utils/loggerService/Logger.service';
import { GameAlert } from './alert';
import { GameCount } from './count';
import { GameInput } from './game.input';
import { GameOverModal } from './gameover.modal';
const MyGameScreenV2 = () => {
  const { gameManager } = useGameManagerContext();
  const loggerObserver: Observer<GameManagerResponse<unknown>> = {
    id: 'loggerObserver',
    update(eventName, response) {
      if (isStartingSequenceResponse(response)) {
        loggerService.debug(
          `New Reaction with duration of ${
            gameManager.getCurrentReaction().duration
          }ms`
        );
      } else if (isReactionStartResponse(response)) {
        loggerService.debugTime('animation');
      } else if (isReactionEndResponse(response)) {
        loggerService.debugTimeEnd('animation');
      }
    },
  };
  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'logger',
    update(eventName, response) {
      if (isCompleteReactionResponse(response)) {
        gameManager.dispatchGenerateNewWithRandomDuration();
        gameManager.dispatchStartingSequence();
      }
    },
  };
  useEffect(() => {
    const difficulty = gameManager.mediator.getDifficulty();
    const game = new GameService(difficulty).createNewGame(
      gameManager.mediator.getUserId()
    );
    const reaction = difficulty.generateReaction(gameManager);

    gameManager.setCurrentGame(game);
    gameManager.setCurrentReaction(reaction);
    const observers = [observer, loggerObserver];
    observers.forEach((o) => gameManager.subscribe(o));

    gameManager.dispatchStartingSequence();

    return () => {
      observers.forEach((o) => gameManager.unsubscribe(o));
    };
  }, []);
  return (
    <div className={'flex flex-col p-4 h-full'}>
      <GameAlert />
      <Flex>
        <AnimationContent className="flex flex-col justify-center items-center">
          <MvpAnimation>
            <GameCount />
          </MvpAnimation>
        </AnimationContent>
        <GameInput />
      </Flex>
      <GameOverModal />
    </div>
  );
};

const MvpAnimation: React.FC<any> = ({ children }) => {
  const { gameManager } = useGameManagerContext();
  const [coloring] = useState(gameManager.mediator.getColoring());
  const [color, setColor] = useState(coloring.countdown);
  const [hasNotStarted, setHasNotStarted] = useState(true);

  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'animationObserver',
    update(eventName, response) {
      if (isStartingSequenceResponse(response)) {
        setHasNotStarted(true);
        setColor(coloring.countdown);
      } else if (isReactionStartResponse(response)) {
        setColor(coloring.waiting);
        setHasNotStarted(false);
        setTimeout(() => {
          gameManager.dispatchReactionEnd();
        }, gameManager.getCurrentReaction().duration);
      } else if (isReactionEndResponse(response)) {
        setHasNotStarted(false);
        setColor(coloring.end);
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
    <Animation
      className={classNames({
        'mask mask-hexagon': true,
        [color]: color,
        'animate-hueRotate': hasNotStarted,
        indicator: true,
      })}
    >
      {children}
    </Animation>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Animation = styled.div`
  height: 11rem;
  width: 11rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const AnimationContent = styled.div`
  flex-grow: 1;
`;

export const GameScreenV2 = withNavigation(MyGameScreenV2);
