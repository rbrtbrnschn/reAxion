import { IGame } from '@reaxion/common/interfaces';
import { difficulties } from '@reaxion/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { withNavigation } from '../../components/navigation';
import { gameToAverageDeviation } from '../../utils/scoreboard/gamesToAverageDeviation';

function useGames() {
  return useQuery({
    queryKey: ['globalGames'],
    queryFn: async (): Promise<IGame[]> => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || ''}/api/game`
      );
      return response.data;
    },
  });
}

const MyGlobalScoreboardScreen = () => {
  const [cookies] = useCookies(['userId']);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const { data } = useGames();

  // const fetchMoreData = async () => {
  //   const myDataSection = games.slice(rangeStart, 10);
  //   setRangeStart((prev) => prev + 10);

  //   setData([...data, ...myDataSection]);
  // };
  // const [targetRef, isFetching] = useInfiniteScroll(fetchMoreData);
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
              <li>
                <a onClick={() => setSortBy(diff.id)}>{diff.name}</a>
              </li>
            ))}
            <li>
              <a onClick={() => setSortBy(undefined)}>All</a>
            </li>
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
                      game.userId === cookies.userId ? 'text-secondary' : ''
                    }
                  >
                    <th>
                      <YouTooltip>{index + 1} </YouTooltip>
                    </th>
                    <td>
                      <YouTooltip>
                        {game?.name?.toUpperCase() || '???'}
                      </YouTooltip>
                    </td>
                    <td>
                      {' '}
                      <YouTooltip>{game.score} </YouTooltip>
                    </td>
                    <td>
                      {' '}
                      <YouTooltip>
                        {gameToAverageDeviation(game).toFixed(2)}ms
                      </YouTooltip>
                    </td>
                    <td>
                      <YouTooltip>{game.difficulty.name} </YouTooltip>
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
