export interface IRoute {
  label: RouteNames;
  path: string;
  element: React.ReactElement;
  index?: boolean;
}
export enum RouteNames {
  HOME_PAGE,
  GAME_PAGE,
  GAME_OVER_PAGE,
}
