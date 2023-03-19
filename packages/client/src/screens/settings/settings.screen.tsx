import { IDifficulty } from '@reaxion/common';
import {
  difficulties,
  GameManagerResponse,
  isSetSettingsResponse,
  Observer,
} from '@reaxion/core';
import { useEffect, useState } from 'react';
import { withNavigation } from '../../components/navigation';
import { useGameManagerContext } from '../../contexts/game-manager.context';
import { useSettings } from '../../hooks/useSettings';

const MySettingsScreen = () => {
  const { gameManager } = useGameManagerContext();
  const [_, setSettings] = useSettings();
  const [activeDifficulty, setActiveDiffulty] = useState<IDifficulty>(
    gameManager.getSettings().difficulty
  );
  // events outside the game loop by adding events to gameManager

  const setSettingsObserver: Observer<GameManagerResponse<unknown>> = {
    id: 'setSettingsObserver',
    update(eventName, response) {
      if (isSetSettingsResponse(response)) {
        setActiveDiffulty(response.state.settings.difficulty);
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
                      console.log(difficulty);
                      gameManager.setSettings({ difficulty: difficulty });
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
    </div>
  );
};

export const SettingsScreen = withNavigation(MySettingsScreen, {
  title: 'Settings',
});
