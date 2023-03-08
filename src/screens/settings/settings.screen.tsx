import { withNavigation } from "../../components/navigation";
import { useStoreActions, useStoreState } from "../../store";
import { gameDifficulties } from "../../store/models/game.model";

const MySettingsScreen = () => {
  const _gameState = useStoreActions((actions) => actions.game);
  const gameState = useStoreState((state) => state.game);

  const mapOverGameDifficulties = (
    cb: (
      key: string,
      difficulty: typeof gameDifficulties[0],
      index: number
    ) => any
  ) =>
    Object.entries(gameDifficulties)
      .filter(([_, e]) => !e.isNotPlayable)
      .map(([key, difficulty], index) => cb(key, difficulty, index));

  return (
    <div className="h-full flex flex-col px-2">
      <div className="prose">
        <h1>Game Mode</h1>

        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Deviation</th>
                <th>Lifes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {mapOverGameDifficulties((key, difficulty, index) => (
                <tr
                  className={gameState.difficulty === index ? "active" : ""}
                  key={key}
                >
                  <th>{difficulty.name}</th>
                  <td>{difficulty.deviation}ms</td>
                  <td>{difficulty.maxFailedAttempts}</td>
                  <td>
                    <button
                      className="btn w-full"
                      onClick={() => _gameState.setGameDifficulty(index)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SettingsScreen = withNavigation(MySettingsScreen, {
  title: "Settings",
});
