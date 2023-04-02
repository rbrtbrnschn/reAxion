import {
  GameManagerResponse,
  GameService,
  isCompleteReactionResponse,
  isReactionEndResponse,
  isReactionStartResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import { useEffect } from 'react';
import styled from 'styled-components';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { loggerService } from '../../utils/loggerService/Logger.service';
import { GameAlert } from './alert';
import { Animation } from './animation';
import { GameCount } from './count';
import { Extra } from './extra';
import { GameInput } from './game.input';
import { GameOverModal } from './gameover.modal';
const MyGameScreenV2 = () => {
  const { gameManager } = useGameManagerContext();
  const loggerObserver: Observer<GameManagerResponse<unknown>> = {
    id: 'loggerObserver',
    update(eventName, response) {
      if (isStartingSequenceResponse(response)) {
        loggerService.debug(
          `New Reaction | duration: ${
            gameManager.getCurrentReaction().duration
          }ms | deviation: ${gameManager.getCurrentReaction().deviation}`
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
          <Extra />
          <Animation>
            <GameCount />
          </Animation>
        </AnimationContent>
        <GameInput />
      </Flex>
      <GameOverModal />
    </div>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const AnimationContent = styled.div`
  flex-grow: 1;
`;

export const GameScreenV2 = withNavigation(MyGameScreenV2);
