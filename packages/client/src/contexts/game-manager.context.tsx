import { GameManager } from '@reaxion/core';
import React, { createContext, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { v4 as uuid4 } from 'uuid';
import { useSettings } from '../hooks/useSettings';

interface IGameManagerContext {
  gameManager: GameManager;
}

export const GameManagerContext = createContext<IGameManagerContext>({
  gameManager: new GameManager(''),
});

export const useGameManagerContext = () => {
  const gameManagerContext = useContext(GameManagerContext);
  return gameManagerContext;
};

export const GameManagerProvider: React.FC<any> = ({ children }) => {
  const [parsedSettings] = useSettings();
  const [cookies, setCookies] = useCookies(['userId']);
  if (!cookies.userId) {
    const expires = new Date('9999-12-31T23:59:59');
    setCookies('userId', uuid4(), { path: '/', expires });
  }
  const gameManager = new GameManager(cookies.userId, {
    settings: parsedSettings,
  });

  return (
    <GameManagerContext.Provider value={{ gameManager }}>
      {children}
    </GameManagerContext.Provider>
  );
};
