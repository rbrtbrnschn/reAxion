import { FilterActionTypes, StateMapper } from "easy-peasy";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { NavComponent } from "../../components/navigation";
import { Table } from "../../components/table";
import { IReactionStatistic } from "../../interfaces/reaction.interface";
import { RouteNames } from "../../interfaces/route.interface";
import { routes } from "../../routes";
import { useStoreActions, useStoreState } from "../../store";
import { GameModel } from "../../store/models/game.model";
import { Screen } from "../../components/common";

export const GameOverScreen = () => {
  const gameState = useStoreState((state) => state.game);
  const _gameState = useStoreActions((state) => state.game);
  const reactionState = useStoreState((state) => state.reaction);
  const [showStatistics, setShowStatistics] = useState(false);

  function handleStatistics(): IReactionStatistic[] {
    const newHistory = reactionState.history
      .filter((e) => e.isGuessed)
      .map((e) => ({
        ...e,
        deviation: Math.abs(e.duration - e.guesses[e.guesses.length - 1]),
      }));
    return newHistory;
  }

  const navigate = useNavigate();
  const handleTryAgain = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(routes[RouteNames.GAME_PAGE].path);
    _gameState.handleGameOver();
  };
  const handleViewStatistics = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowStatistics((a) => !a);
  };

  useRedirectToGamePage(gameState, navigate);

  return (
    <Screen className="py-12">
      {/* Code block starts */}
      <NavComponent />
      <div>
        <div className="w-full px-6">
          <div className="mt-8 relative rounded-lg bg-indigo-700 container mx-auto flex flex-col items-center pt-12 sm:pt-24 pb-24 sm:pb-32 md:pb-48 lg:pb-56 xl:pb-64">
            <img
              className="mr-2 lg:mr-12 mt-2 lg:mt-12 absolute right-0 top-0"
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg2.svg"
              alt="bg"
            />
            <img
              className="ml-2 lg:ml-12 mb-2 lg:mb-12 absolute bottom-0 left-0"
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg3.svg"
              alt="bg"
            />
            <div className="w-11/12 sm:w-2/3 mb-5 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-white font-bold leading-tight">
                Game Over
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center text-white font-bold leading-tight">Final Score: <span className={gameState.score > 15 ? "text-green-400" : "text-yellow-400"}>{gameState.score}</span></h2>
            </div>
            <div className="flex justify-center items-center mb-10 sm:mb-20">
              <button
                onClick={handleTryAgain}
                className="hover:text-white hover:bg-transparent lg:text-xl hover:border-white border bg-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-indigo-700	focus:ring-white rounded text-indigo-700 px-4 sm:px-8 py-1 sm:py-3 text-sm"
              >
                Try Again
              </button>
              <button
                onClick={handleViewStatistics}
                className="hover:bg-white hover:text-indigo-600 lg:text-xl hover:border-indigo-600 ml-3 sm:ml-6 bg-transparent transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-indigo-700 focus:ring-white hover:bg-indigo-700-800 rounded border border-white text-white px-4 sm:px-8 py-1 sm:py-3 text-sm"
              >
                View Statistics
              </button>
            </div>
          </div>
          <div className="container mx-auto flex justify-center md:-mt-56 -mt-20 sm:-mt-40">
            <div className="relative sm:w-2/3 w-11/12">
              <Table
                className={showStatistics ? "IS__OPEN" : ""}
                data={handleStatistics()}
                resolver={(e) => {
                  const headerRow = [
                    "Duration",
                    "Deviation",
                    "Attempts",
                    "Guessed",
                  ];
                  const bodyRows = e.map((entry) => [
                    entry.duration + "",
                    entry.deviation + "",
                    entry.guesses.length + "",
                    entry.isGuessed
                      ? entry.guesses[entry.guesses.length - 1] + ""
                      : "Failed",
                  ]);

                  return [headerRow, bodyRows];
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Code block ends */}
    </Screen>
  );
};

/**
 * Redirects User to GameScreen if there's no Gameover
 * @param state {StateMapper<FilterActionTypes<GameModel>>} - `gameModel` state
 * @param navigate {NavigateFunction} - ReturnType of useNavigate()
 */
function useRedirectToGamePage(
  state: StateMapper<FilterActionTypes<GameModel>>,
  navigate: NavigateFunction
) {
  useEffect(() => {
    if (!state.isGameOver) navigate(routes[RouteNames.GAME_PAGE].path);
  }, []);
}
