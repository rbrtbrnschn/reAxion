import { GameManager } from '@reaxion/core';
import React, { createContext, useContext } from 'react';

interface IGameManagerContext {
  gameManager: GameManager;
}

export const GameManagerContext = createContext<IGameManagerContext>({
  gameManager: new GameManager(),
});

export const useGameManagerContext = () => {
    const gameManagerContext = useContext(GameManagerContext);
    return gameManagerContext;
}

export const GameManagerProvider: React.FC<any> = ({ children }) => {
  const gameManager = new GameManager();

  return (
    <GameManagerContext.Provider value={{ gameManager }}>
      {children}
    </GameManagerContext.Provider>
  );
};

