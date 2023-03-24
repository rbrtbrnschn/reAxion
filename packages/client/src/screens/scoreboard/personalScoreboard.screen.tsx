import { IGameWithStats } from '@reaxion/common/interfaces';
import { difficulties } from '@reaxion/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';

function useGames() {
  const { settingsManager } = useGameManagerContext();
  const userId = settingsManager.getUserId();
  const offset = 0;
  const limit = 50;
  return useQuery({
    queryKey: ['personalGame'],
    queryFn: async (): Promise<IGameWithStats[]> => {
      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || ''
        }/api/game?offset=${offset}&limit=${limit}&userId=${userId}`
      );
      return response.data;
    },
  });
}

const MyPersonalScoreboardScreen = () => {
  const { data, isError, isLoading } = useGames();
  const [sortBy, setSortBy] = useState<string | undefined>();

  //const [targetRef, isFetching] = useInfiniteScroll(fetchMoreData);

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
                  <tr key={'game-' + (index + 1)}>
                    <th>{index + 1}</th>
                    <td>{game?.name?.toUpperCase() || '???'}</td>
                    <td>{game.score}</td>
                    <td>
                      {game.averageDeviation.toFixed(2)}
                      ms
                    </td>
                    <td>{game.difficulty?.name}</td>
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

export const PersonalScoreboardScreen = withNavigation(
  MyPersonalScoreboardScreen,
  { title: 'Personal Scoreboard' }
);
