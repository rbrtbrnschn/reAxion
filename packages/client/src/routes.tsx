import { ReactNode } from 'react';
import { GameScreen } from './screens/game/game.screen';
import { GameScreenV2 } from './screens/gamev2/game.screen';
import { HomeScreen } from './screens/home/home.screen';
import { GlobalScoreboardScreen } from './screens/scoreboard/globalScoreboard.screen';
import { PersonalScoreboardScreen } from './screens/scoreboard/personalScoreboard.screen';
import { SettingsScreen } from './screens/settings/settings.screen';
import { GameOverviewScreen } from './screens/stats/gameOverview.screen';

export enum RouteNames {
  HOME_PAGE,
  GAME_PAGE,
  RECENT_STATS_PAGE,
  SCOREBOARD_PERSONAL_PAGE,
  SCOREBOARD_GLOBAL_PAGE,
  SETTINGS_PAGE,
  MVP_PAGE,
  GAME_PAGE_V2,
}

export const routes: Record<
  RouteNames,
  { path: string; element: ReactNode; index?: true }
> = {
  [RouteNames.HOME_PAGE]: {
    path: '/',
    element: <HomeScreen />,
  },
  [RouteNames.GAME_PAGE]: {
    path: '/game',
    element: <GameScreenV2 />,
    index: true,
  },
  [RouteNames.RECENT_STATS_PAGE]: {
    path: '/stats/recent',
    element: <GameOverviewScreen />,
  },
  [RouteNames.SCOREBOARD_PERSONAL_PAGE]: {
    path: '/scoreboard/personal',
    element: <PersonalScoreboardScreen />,
  },
  [RouteNames.SCOREBOARD_GLOBAL_PAGE]: {
    path: '/scoreboard/global',
    element: <GlobalScoreboardScreen />,
  },
  [RouteNames.SETTINGS_PAGE]: {
    path: '/settings',
    element: <SettingsScreen />,
  },
  [RouteNames.GAME_PAGE_V2]: {
    path: '/old',
    element: <GameScreen />,
  },
  [RouteNames.MVP_PAGE]: {
    path: '/mvp',
    element: <div>TODO</div>,
  },
};
