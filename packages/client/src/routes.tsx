import { RouteNames } from '@reaxion/common';
import { ReactNode } from 'react';
import { GameScreen } from './screens/game/game.screen';
import { HomeScreen } from './screens/home/home.screen';
import { GlobalScoreboardScreen } from './screens/scoreboard/globalScoreboard.screen';
import { PersonalScoreboardScreen } from './screens/scoreboard/personalScoreboard.screen';
import { SettingsScreen } from './screens/settings/settings.screen';
import { GameOverviewScreen } from './screens/stats/gameOverview.screen';

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
    element: <GameScreen />,
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
};
