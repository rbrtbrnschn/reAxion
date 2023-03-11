import { IGame } from '@reaxion/common/interfaces';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { withNavigation } from '../../components/navigation';
import { gameDifficulties } from '../../store/models/game.model';
import { gameToAverageDeviation } from '../../utils/scoreboard/gamesToAverageDeviation';

function useGames() {
  return useQuery({
    queryKey: ['game'],
    queryFn: async (): Promise<IGame[]> => {
  console.log("using:",process.env.REACT_APP_API_URL)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/game`);
      return response.data;
    },
  });
}

const MyGlobalScoreboardScreen = () => {
  const [rangeStart, setRangeStart] = useState(0);
  const { data } = useGames();

  // const fetchMoreData = async () => {
  //   const myDataSection = games.slice(rangeStart, 10);
  //   setRangeStart((prev) => prev + 10);

  //   setData([...data, ...myDataSection]);
  // };
  // const [targetRef, isFetching] = useInfiniteScroll(fetchMoreData);
  return (
    <div className="h-full flex flex-col px-2">
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
            {data?.map((game, index) => {
              console.warn("global",gameToAverageDeviation(game),game.reactions)
              return (
                <tr key={'game-' + (index + 1)}>
                  <th>{index + 1}</th>
                  <td>{game.name.toUpperCase() || '???'}</td>
                  <td>{game.score}</td>
                  <td>{gameToAverageDeviation(game).toFixed(2)}ms</td>
                  <td>{gameDifficulties[game.difficulty].name}</td>
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
