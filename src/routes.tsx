import { App } from "./App";
import { RouteNames } from "./interfaces/route.interface";
import { GameScreen } from "./screens/game/game.screen";
import { GameOverScreen } from "./screens/game/gameover.screen";

export const routes: Record<
  RouteNames,
  { path: string; element: React.ReactNode; index?: boolean }
> = {
  [RouteNames.HOME_PAGE]: {
    path: "/WIP",
    element: <App />,
  },
  [RouteNames.GAME_PAGE]: {
    path: "/",
    element: <GameScreen />,
    index: true,
  },
  [RouteNames.GAME_OVER_PAGE]: {
    path: "/game-over",
    element: <GameOverScreen />,
  },
};
