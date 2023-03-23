import { RouteNames } from '@reaxion/common/enums';
import { useNavigate } from 'react-router-dom';
import { routes } from '../routes';

interface INavigationItem {
  label: string;
  path: string;
  onClick?: () => void;
}
interface Props {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  navbarItems: INavigationItem[];
  drawerItems: INavigationItem[];
}
export const Navigation = ({
  title,
  navbarItems,
  drawerItems,
  children,
}: Props) => {
  const navigate = useNavigate();
  const resolveItems = ({ label, path }: INavigationItem, i: number) => (
    <li key={`linkFor=${label}&to=${path}`}>
      <div className={window.location.pathname === path ? "text-purple-500" : ""} onClick={() => navigate(path)}>{label}</div>
    </li>
  );
  const NavbarItems = navbarItems.map(resolveItems);
  const DrawerItems = drawerItems.map(resolveItems);
  return (
    <div
      className="drawer"
      style={{
        width: '100svw',
        height: '100svh',
      }}
    >
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* <!-- Navbar --> */}
        <div className="w-full navbar bg-base-100">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
          </div>
          <div className="btn btn-ghost normal-case text-xl lg:hidden">{title}</div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {/* <!-- Navbar menu content here --> */}
              {NavbarItems}
            </ul>
          </div>
        </div>
        {/* <!-- Page content here --> */}
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100">
          {/* <!-- Sidebar content here --> */}
          {DrawerItems}
        </ul>
      </div>
    </div>
  );
};

export function withNavigation<P extends {}>(
  Component: React.FC<P>,
  navigationProps?: Partial<Omit<Props, 'children'>>
) {
  return (props: P) => {
    const defaultsNavigationProps: Omit<Props, 'children'> = {
      title: 'ReAxion',
      drawerItems: [
        { label: 'Home', path: routes[RouteNames.HOME_PAGE].path },
        { label: 'Game', path: routes[RouteNames.GAME_PAGE].path },
        {
          label: 'Game Overview',
          path: routes[RouteNames.RECENT_STATS_PAGE].path,
        },
        {
          label: 'Scoreboard',
          path: routes[RouteNames.SCOREBOARD_PERSONAL_PAGE].path,
        },
        {
          label: 'Scoreboard Global',
          path: routes[RouteNames.SCOREBOARD_GLOBAL_PAGE].path,
        },
        { label: 'Settings', path: routes[RouteNames.SETTINGS_PAGE].path },
      ],
      navbarItems: [
        { label: 'Home', path: routes[RouteNames.HOME_PAGE].path },
        { label: 'Game', path: routes[RouteNames.GAME_PAGE].path },
        {
          label: 'Game Overview',
          path: routes[RouteNames.RECENT_STATS_PAGE].path,
        },
        {
          label: 'Scoreboard',
          path: routes[RouteNames.SCOREBOARD_PERSONAL_PAGE].path,
        },
        {
          label: 'Scoreboard Global',
          path: routes[RouteNames.SCOREBOARD_GLOBAL_PAGE].path,
        },
        { label: 'Settings', path: routes[RouteNames.SETTINGS_PAGE].path },
      ],
    };
    return (
      <Navigation {...defaultsNavigationProps} {...navigationProps}>
        <Component {...props} />
      </Navigation>
    );
  };
}
