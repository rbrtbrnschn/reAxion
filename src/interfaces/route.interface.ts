import { RouteNames } from "../enums/routes.enum";

export interface IRoute {
  label: RouteNames;
  path: string;
  element: React.ReactElement;
  index?: boolean;
}
