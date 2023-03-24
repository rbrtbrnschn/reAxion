import { IDifficulty, IGame, IGameWithStats } from '@reaxion/common/interfaces';
import { DefaultSettingsHandlerImpl, difficulties } from '@reaxion/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';

const MyGlobalScoreboardScreen = () => {
  const { settingsManager } = useGameManagerContext();
  const [sortBy, setSortBy] = useState<IDifficulty['id']>(
    DefaultSettingsHandlerImpl.defaultSettings.difficulty.id
  );

  function useGames() {
    return useQuery({
      queryKey: ['globalGames'],
      queryFn: async (): Promise<IGameWithStats[]> => {
        const response = await axios.get(
          `${
            process.env.REACT_APP_API_URL || ''
          }/api/game/leaderboard?difficulty=${sortBy}`
        );
        return response.data;
      },
    });
  }
  const { data, isError, isLoading, refetch } = useGames();
  const userHasWonGame = (game: IGame) =>
    game.userId === settingsManager.getUserId();

  useEffect(() => {
    refetch();
  }, [sortBy]);

  if (isError) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="h-full flex flex-col px-2">
      <div className="flex" style={{ justifyContent: 'end' }}>
        <div className="dropdown dropdown-bottom dropdown-end">
          <label tabIndex={0} className="btn m-1">
            Filter Difficulty
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {Object.values(difficulties).map((diff) => (
              <li key={diff.id}>
                <a onClick={() => setSortBy(diff.id)}>{diff.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Score</th>
              <th>Deviation (avg.)</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data
              ?.filter((game) => {
                if (!sortBy) return true;
                return game.difficulty.id === sortBy;
              })
              .sort((a, b) => b.score - a.score)
              .map((game, index) => {
                return (
                  <tr
                    key={'game-' + (index + 1)}
                    className={
                      game.userId === settingsManager.getUserId()
                        ? 'text-secondary'
                        : ''
                    }
                  >
                    <th>
                      {userHasWonGame(game) ? (
                        <YouTooltip>{index + 1} </YouTooltip>
                      ) : (
                        index + 1
                      )}
                    </th>
                    <td>
                      {userHasWonGame(game) ? (
                        <YouTooltip>
                          {game?.name?.toUpperCase() || '???'}
                        </YouTooltip>
                      ) : (
                        game?.name?.toUpperCase() || '???'
                      )}
                    </td>
                    <td>
                      {userHasWonGame(game) ? (
                        <YouTooltip>{game.score} </YouTooltip>
                      ) : (
                        game.score
                      )}
                    </td>
                    <td>
                      {userHasWonGame(game) ? (
                        <YouTooltip>
                          {game.averageDeviation.toFixed(2)}
                          ms
                        </YouTooltip>
                      ) : (
                        game.averageDeviation.toFixed(2) + 'ms'
                      )}
                    </td>
                    <td>
                      {userHasWonGame(game) ? (
                        <YouTooltip>{game.difficulty.name} </YouTooltip>
                      ) : (
                        game.difficulty.name
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* {isFetching && <div>Loading...</div>}
        <div ref={targetRef}></div> */}
      </div>
    </div>
  );
};

export const GlobalScoreboardScreen = withNavigation(MyGlobalScoreboardScreen, {
  title: 'Global Scoreboard',
});

const YouTooltip: React.FC<any> = ({ children }) => {
  return (
    <span className="tooltip tooltip-secondary" data-tip="You">
      {children}
    </span>
  );
};
