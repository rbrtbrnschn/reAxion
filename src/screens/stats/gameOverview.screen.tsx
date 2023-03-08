import { FilterActionTypes, StateMapper } from "easy-peasy";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { withNavigation } from "../../components/navigation";
import { Stat1 } from "../../components/stats/stat1";
import { RouteNames } from "../../enums/routes.enum";
import { IGame } from "../../interfaces/game.interface";
import { routes } from "../../routes";
import { useStoreActions, useStoreState } from "../../store";
import { GameModel } from "../../store/models/game.model";
import { StatsProcessingService } from "../../utils/stats/statsProcessingService";

const MyGameOverviewScreen = () => {
  const gameState = useStoreState((state) => state.game);
  const _gameState = useStoreActions((state) => state.game);
  const reactionState = useStoreState((state) => state.reaction);
  const game = gameState.history[0];

  const navigate = useNavigate();
  const handleTryAgain = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(routes[RouteNames.GAME_PAGE].path);
  };
  const statsProcessor = new StatsProcessingService(game);
  function parseMillisecond(number: number) {
    return number.toFixed(2) + "ms";
  }
  function parseSecond(number: number) {
    return (number / 1000).toFixed(2) + "s";
  }
  return (
    <div className="h-full px-2 flex flex-col gap-4">
      <div></div>
      <Stat1 title="Score" number={game?.score.toString() || "0"} label="" />
      <Stat1
        title="Average Deviation"
        number={parseMillisecond(statsProcessor.getAverageDeviation())}
        label=""
      />
      <Stat1
        title="Game Time"
        number={parseSecond(statsProcessor.getGameTime())}
        label=""
      />
      <Stat1
        number={parseMillisecond(
          statsProcessor.getAverageTimeForCorrectGuess()
        )}
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

export const GameOverviewScreen = withNavigation(MyGameOverviewScreen, {
  title: "Game Overview",
});
