import { ReactNode } from "react";
import { App } from "./App";
import { RouteNames } from "./enums/routes.enum";
import { GameScreen } from "./screens/game/game.screen";
import { PersonalScoreboardScreen } from "./screens/scoreboard/personalScoreboard.screen";
import { GameOverviewScreen } from "./screens/stats/gameOverview.screen";

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
  [RouteNames.RECENT_STATS_PAGE]: {
    path: "/stats/recent",
    element: <GameOverviewScreen />,
  },
  [RouteNames.SCOREBOARD_PERSONAL]: {
    path: "/scoreboard/personal",
    element: <PersonalScoreboardScreen />,
  },
  [RouteNames.SCOREBOARD_GLOBAL]: {
    path: "/scoreboard/global",
    element: <div>WIP</div>,
  },
};
