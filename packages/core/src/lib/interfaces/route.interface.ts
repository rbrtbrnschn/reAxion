import * as React from 'react';
import { RouteNames } from '../../../../core/src/lib/enums/routes.enum';

export interface IRoute {
  label: RouteNames;
  path: string;
  element: React.ReactElement;
  index?: boolean;
}
