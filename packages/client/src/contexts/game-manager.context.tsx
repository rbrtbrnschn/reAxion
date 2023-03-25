import {
  GameManager,
  GameManagerMediator,
  LocalStorageMiddleware,
  LocalStoragePersistorImpl,
  PersistedSettingsManagerBuilder,
  RehydrateSettingsMiddleware,
  SettingsManager,
  UserIdFromCookieMiddleware,
} from '@reaxion/core';
import React, { createContext, useContext } from 'react';

interface IGameManagerContext {
  gameManager: GameManager;
  settingsManager: SettingsManager;
}

export const GameManagerContext = createContext<IGameManagerContext>({
  gameManager: new GameManager(new GameManagerMediator(new SettingsManager())),
  settingsManager: new SettingsManager(),
});

export const useGameManagerContext = () => {
  const gameManagerContext = useContext(GameManagerContext);
  return gameManagerContext;
};

export const GameManagerProvider: React.FC<any> = ({ children }) => {
  const settingsManager = new PersistedSettingsManagerBuilder()
    .withMiddleware([
      LocalStorageMiddleware,
      RehydrateSettingsMiddleware,
      UserIdFromCookieMiddleware,
    ])
    .withPersistorStrategy(new LocalStoragePersistorImpl())
    .createWithInitialState();
  const gameManagerMediator = new GameManagerMediator(settingsManager);
  const gameManager = new GameManager(gameManagerMediator);

  return (
    <GameManagerContext.Provider value={{ gameManager, settingsManager }}>
      {children}
    </GameManagerContext.Provider>
  );
};
