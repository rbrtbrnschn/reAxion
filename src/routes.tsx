import { ReactNode } from "react";
import { App } from "./App";
import { RouteNames } from "./interfaces/route.interface";
import { GameScreen } from "./screens/game/game.screen";
import { StatsScreen } from "./screens/stats/stats.screen";
import { HomeScreen } from "./screens/home/home.screen";

export const routes: Record<
  RouteNames,
  { path: string; element: ReactNode; index?: true }
> = {
  [RouteNames.HOME_PAGE]: {
    path: "/",
    element: <App />,
  },
  [RouteNames.GAME_PAGE]: {
    path: "/game",
    element: <GameScreen />,
    index: true,
  },
  [RouteNames.GAME_OVER_PAGE]: {
    path: "/game-over",
    element: <StatsScreen />,
  },
};
