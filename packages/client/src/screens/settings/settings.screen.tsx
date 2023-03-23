import { IColor, IDifficulty } from '@reaxion/common';
import {
  colorings,
  difficulties,
  isSetColoringResponse,
  isSetDifficultyResponse,
  isSetUserIdResponse,
  Observer,
  SettingsManagerResponse,
} from '@reaxion/core';
import { useEffect, useState } from 'react';
import { validate } from 'uuid';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';

enum UserIdChangeStatus {
  IS_OLD = 'IS_OLD',
  IS_ERROR = 'IS_ERROR',
  IS_VALID = 'IS_VALID',
}
enum UsernameChangeStatus {
  IS_ERROR = 'IS_ERROR',
  IS_VALID = 'IS_VALID',
  IS_OLD = 'IS_OLD',
}
const MySettingsScreen = () => {
  const { gameManager, settingsManager } = useGameManagerContext();
  const [activeDifficulty, setActiveDiffulty] = useState<IDifficulty>(
    gameManager.mediator.getDifficulty()
  );
  const [activeColoring, setActiveColoring] = useState<IColor>(
    gameManager.mediator.getColoring()
  );
  const [userIdValue, setUserIdValue] = useState(
    gameManager.mediator.getUserId()
  );
  const [userIdError, setUserIdError] = useState<UserIdChangeStatus>(
    UserIdChangeStatus.IS_OLD
  );
  const [usernameValue, setUsernameValue] = useState(
    settingsManager.getUsername()
  );
  const [usernameError, setUsernameError] = useState<UsernameChangeStatus>(
    UsernameChangeStatus.IS_OLD
  );

  const onChangeUserIdValue: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setUserIdValue(e.currentTarget.value);
  };
  const handleSubmitUserId = () => {
    if (!validate(userIdValue) || userIdValue.length !== 36)
      return setUserIdError(UserIdChangeStatus.IS_ERROR);
    settingsManager.setUserId(userIdValue);
    setUserIdError(UserIdChangeStatus.IS_VALID);
  };
  const onChangeUsernameValue: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.currentTarget.value.length > 3) return;
    setUsernameValue(e.currentTarget.value);
  };
  const handleSubmitUsername = () => {
    if (!usernameValue || usernameValue.length !== 3)
      return setUsernameError(UsernameChangeStatus.IS_ERROR);
    settingsManager.setUsername(usernameValue);
    setUsernameError(UsernameChangeStatus.IS_VALID);
  };

  const setSettingsObserver: Observer<SettingsManagerResponse<unknown>> = {
    id: 'setSettingsObserver',
    update(eventName, response) {
      if (isSetColoringResponse(response)) {
        setActiveColoring(response.state.coloring);
      }
      if (isSetDifficultyResponse(response)) {
        setActiveDiffulty(response.state.difficulty);
      }
      if (isSetUserIdResponse(response)) {
        setUserIdValue(response.state.userId);
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
    settingsManager.subscribe(setSettingsObserver);

    return () => {
      settingsManager.unsubscribe(setSettingsObserver);
    };
  }, []);

  return (
    <div className="h-full flex flex-col px-2">
      <div className="lg:hero">
        <div className="hero-content flex-col lg:flex-row-reverse ">
          <div className="flex-col lg:flex-row-reverse">
            <div className="prose">
              <h2>Game Mode</h2>
              <p>Choose your difficulty.</p>
            </div>
            <div className="overflow-x-scroll w-full flex-grow-0 flex-shrink-1">
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
                            settingsManager.setDifficulty(difficulty);
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
            <div className="divider"></div>
            <div className="prose">
              <h2>Reaction Signal Colors</h2>
              <p>This may help if you're color blind.</p>
            </div>
            <div className="overflow-x-scroll w-full flex-shrink-1 flex-grow-0">
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
                            settingsManager.setColoring(coloring);
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
            <div className="divider"></div>
            <div className="prose">
              <h2>Change User Id</h2>
              <p>
                Disclaimer: Use at your own risk. Games may no longer be shown
                to be yours.
              </p>
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
                    placeholder="Input your userId from another device."
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
            <div className="divider"></div>
            <div className="prose">
              <h2>Set username</h2>
              <p>This will autosave if you gain a score of 1 and above.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitUsername();
              }}
              className="w-full pb-5 pt-2"
            >
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="XYZ"
                    className={`input input-bordered w-full uppercase ${
                      usernameError === UsernameChangeStatus.IS_ERROR
                        ? 'input-error'
                        : usernameError === UsernameChangeStatus.IS_VALID
                        ? 'input-success'
                        : ''
                    }`}
                    onChange={onChangeUsernameValue}
                    value={usernameValue}
                  />
                  <button className="btn" type="submit">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsScreen = withNavigation(MySettingsScreen, {
  title: 'Settings',
});
