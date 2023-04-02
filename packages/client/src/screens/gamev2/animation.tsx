import {
  GameManagerResponse,
  isReactionEndResponse,
  isReactionStartResponse,
  isStartingSequenceResponse,
  Observer,
} from '@reaxion/core';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGameManagerContext } from '../../contexts/game-manager.context';

export const Animation: React.FC<any> = ({ children }) => {
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
    <StyledAnimation
      className={classNames({
        'mask mask-hexagon': true,
        [color]: color,
        'animate-hueRotate': hasNotStarted,
        indicator: true,
      })}
    >
      {children}
    </StyledAnimation>
  );
};
const StyledAnimation = styled.div`
  height: 11rem;
  width: 11rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
