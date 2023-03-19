import { GuessStatus, ReactionStatus } from '@reaxion/common';
import {
  EasyDifficulty,
  Game,
  GameManagerResponse,
  isCompleteReactionResponse,
  isReactionEndResponse,
  isReactionStartResponse,
  isStartingSequenceResponse,
  Observer,
  Reaction,
} from '@reaxion/core';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid4 } from 'uuid';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { GameAlert } from './alert';
import { GameCount } from './count';
import { GameInput } from './game.input';
import { GameOverModal } from './gameover.modal';
const MyGameScreenV2 = () => {
  const { gameManager } = useGameManagerContext();
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
      new Game(new EasyDifficulty(), 0, 0, uuid4(), [], [])
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
  const [color, setColor] = useState('bg-red-500');
  const [hasNotStarted, setHasNotStarted] = useState(true);

  const observer: Observer<GameManagerResponse<unknown>> = {
    id: 'animationObserver',
    update(eventName, response) {
      console.log(eventName);
      if (isStartingSequenceResponse(response)) {
        setHasNotStarted(true);
        setColor('bg-red-500');
      } else if (isReactionStartResponse(response)) {
        setColor('bg-orange-500');
        setHasNotStarted(false);
        setTimeout(() => {
          gameManager.dispatchReactionEnd();
        }, gameManager.getCurrentReaction().duration);
      } else if (isReactionEndResponse(response)) {
        setHasNotStarted(false);
        setColor('bg-green-500');
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
`;

const AnimationContent = styled.div`
  flex-grow: 1;
`;
export const GameScreenV2 = withNavigation(MyGameScreenV2);
