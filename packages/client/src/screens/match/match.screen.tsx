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
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { loggerService } from '../../utils/loggerService/Logger.service';
import { GameAlert } from '../gamev2/alert';
import { Animation } from '../gamev2/animation';
import { GameCount } from '../gamev2/count';
import { Extra } from '../gamev2/extra';
import { GameInput } from '../gamev2/game.input';
import { GameOverModal } from '../gamev2/gameover.modal';
import { Extra as Extra2 } from './extra';

const MyMatchScreen = () => {
  const { gameManager } = useGameManagerContext();
  const { roomId } = useParams();

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
          <Extra2 />
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

export const MatchScreen = withNavigation(MyMatchScreen);
