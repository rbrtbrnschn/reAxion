import { IColor, IDifficulty } from '@reaxion/common';
import {
  colorings,
  difficulties,
  GameManagerResponse,
  isSetSettingsResponse,
  Observer,
} from '@reaxion/core';
import { useEffect, useState } from 'react';
import { validate } from 'uuid';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { useSettings } from '../../hooks/useSettings';

enum UserIdChangeStatus {
  IS_OLD = 'IS_OLD',
  IS_ERROR = 'IS_ERROR',
  IS_VALID = 'IS_VALID',
}
const MySettingsScreen = () => {
  const { gameManager } = useGameManagerContext();
  const [settings, setSettings] = useSettings();
  const [activeDifficulty, setActiveDiffulty] = useState<IDifficulty>(
    gameManager.getSettings().difficulty
  );
  const [activeColoring, setActiveColoring] = useState<IColor>(
    gameManager.getSettings().coloring
  );
  const [userIdValue, setUserIdValue] = useState(settings.userId);
  const [userIdError, setUserIdError] = useState<UserIdChangeStatus>(
    UserIdChangeStatus.IS_OLD
  );

  const onChangeUserIdValue: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setUserIdValue(e.currentTarget.value);
  };
  const handleSubmitUserId = () => {
    if (!validate(userIdValue) || userIdValue.length !== 36)
      return setUserIdError(UserIdChangeStatus.IS_ERROR);
    setSettings({ ...settings, userId: userIdValue });
    setUserIdError(UserIdChangeStatus.IS_VALID);
  };
  // events outside the game loop by adding events to gameManager

  const setSettingsObserver: Observer<GameManagerResponse<unknown>> = {
    id: 'setSettingsObserver',
    update(eventName, response) {
      if (isSetSettingsResponse(response)) {
        setActiveDiffulty(response.state.settings.difficulty);
        setActiveColoring(response.state.settings.coloring);
        setSettings(response.state.settings);
      }
    },
  };

  const mapOverGameDifficulties = (
    cb: (key: string, difficulty: IDifficulty, index: number) => any
  ) =>
    Object.entries(difficulties).map(([key, difficulty], index) =>
      cb(key, difficulty, index)
    );

  const mapOverGameColorings = (
    cb: (key: string, coloring: IColor, index: number) => any
  ) =>
    Object.entries(colorings).map(([key, coloring], index) =>
      cb(key, coloring, index)
    );

  useEffect(() => {
    gameManager.subscribe(setSettingsObserver);

    return () => {
      gameManager.unsubscribe(setSettingsObserver);
    };
  }, []);

  return (
    <div className="h-full flex flex-col px-2">
      <div className="prose">
        <h1>Game Mode</h1>
        <p></p>
      </div>

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
                className={
                  activeDifficulty.id === difficulty.id ? 'active' : ''
                }
                key={key}
              >
                <th>{difficulty.name}</th>
                <td>{difficulty.deviation}ms</td>
                <td>{difficulty.maxFailedAttempts}</td>
                <td>
                  <button
                    className="btn w-full"
                    onClick={() => {
                      gameManager.setSettings({
                        difficulty: difficulty,
                        coloring: activeColoring,
                        userId: settings.userId,
                      });
                    }}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 prose">
        <h1 className="pt-3">Reaction Signal Colors</h1>
        <p></p>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <tbody>
            {/* row 1 */}
            {mapOverGameColorings((key, coloring, index) => (
              <tr
                className={
                  activeColoring.countdown === coloring.countdown
                    ? 'active'
                    : ''
                }
                key={key}
              >
                <td>
                  <div className={coloring.countdown + ' p-5'}></div>
                </td>
                <td>
                  <div className={coloring.waiting + ' p-5'}></div>
                </td>
                <td>
                  <div className={coloring.end + ' p-5'}></div>
                </td>
                <td>
                  <button
                    className="btn w-full"
                    onClick={() => {
                      gameManager.setSettings({
                        ...settings,
                        difficulty: activeDifficulty,
                        coloring: coloring,
                      });
                    }}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose">
        <h1>Change User Id</h1>
        <h3>
          Disclaimer: Use at your own risk. Games may no longer be shown to be
          yours.
        </h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitUserId();
        }}
        className="w-full pb-5"
      >
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Input your guess in ms..."
              className={`input input-bordered w-full ${
                userIdError === UserIdChangeStatus.IS_ERROR
                  ? 'input-error'
                  : userIdError === UserIdChangeStatus.IS_VALID
                  ? 'input-success'
                  : ''
              }`}
              onChange={onChangeUserIdValue}
              value={userIdValue}
            />
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const SettingsScreen = withNavigation(MySettingsScreen, {
  title: 'Settings',
});
