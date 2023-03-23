import { RouteNames } from '@reaxion/common/enums';
import { IGame } from '@reaxion/common/interfaces';
import { GameProcessingService } from '@reaxion/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { withNavigation } from '../../components/navigation';
import { Stat1 } from '../../components/stats/stat1';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { useSettings } from '../../hooks/useSettings';
import { routes } from '../../routes';

function useGameOverviewGame() {
  const [settings] = useSettings();
  const userId = settings.userId;
  return useQuery({
    queryKey: ['gameOverview'],
    queryFn: async (): Promise<IGame | undefined> => {
      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || ''
        }/api/game/overview?userId=${userId}`
      );
      return response.data;
    },
  });
}

const MyGameOverviewScreen = () => {
  const { gameManager } = useGameManagerContext();
  let data;
  const lastGame = useGameOverviewGame();

  /* TODO Refactor to Strategy Pattern */
  try {
    const currentGame = gameManager.getPreviousGame();
    data = { data: currentGame, isLoading: false, isError: false };
  } catch (e) {
    data = lastGame;
  }

  const navigate = useNavigate();

  if (data.isError) return <div>Error</div>;
  if (data.isLoading) return <div>Loading...</div>;
  if (!data.data) return navigate('/game');
  const { data: game } = data;

  const handleTryAgain = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(routes[RouteNames.GAME_PAGE].path);
  };
  const statsProcessor = new GameProcessingService(game);
  function parseMillisecond(number: number) {
    return number.toFixed(2) + 'ms';
  }
  function parseSecond(number: number) {
    return (number / 1000).toFixed(2) + 's';
  }

  return (
    <div className="h-full px-2 flex flex-col gap-4">
      <div className="prose">
        <h3>Name: {game.name?.toUpperCase()}</h3>
        <p>Difficulty: {game.difficulty?.name}</p>
      </div>
      <Stat1 title="Score" number={game?.score.toString() || '0'} label="" />
      <Stat1
        title="Average Deviation"
        number={
          isNaN(statsProcessor.getAverageDeviation())
            ? 'Try to win first.'
            : parseMillisecond(statsProcessor.getAverageDeviation())
        }
        label=""
      />
      <Stat1
        title="Game Time"
        number={
          statsProcessor.getGameTime() === 0
            ? 'Try to win first.'
            : parseSecond(statsProcessor.getGameTime())
        }
        label=""
      />
      <Stat1
        number={
          isNaN(statsProcessor.getAverageTimeForCorrectGuess())
            ? 'Try to win first.'
            : parseMillisecond(statsProcessor.getAverageTimeForCorrectGuess())
        }
        title="Average Time To Guess Correctly"
        label=""
      />
      <button className="btn btn-primary" onClick={handleTryAgain}>
        Try Again
      </button>
    </div>
  );
};

/**
 * Redirects User to GameScreen if there's no Gameover
 * @param state {StateMapper<FilterActionTypes<GameModel>>} - `gameModel` state
 * @param navigate {NavigateFunction} - ReturnType of useNavigate()
 */
function useRedirectToGamePage(
  game: IGame | null | undefined,
  navigate: NavigateFunction
) {
  useEffect(() => {
    if (!game) navigate(routes[RouteNames.GAME_PAGE].path);
  }, []);
}

export const GameOverviewScreen = withNavigation(MyGameOverviewScreen as any, {
  title: 'Game Overview',
});
