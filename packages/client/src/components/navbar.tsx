import { useNavigate } from 'react-router-dom';
import { RouteNames, routes } from '../routes';

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-100 ">
      <div className="navbar-start">
        <div className="tooltip tooltip-secondary tooltip-bottom">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
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
            {/* Mobile View */}
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <div
                  onClick={() =>
                    navigate(routes[RouteNames.SETTINGS_PAGE].path)
                  }
                >
                  Settings
                </div>
              </li>
              <li tabIndex={0}>
                <div className="justify-between">
                  Leaderboards
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </div>
                <ul className="p-2 bg-base-100">
                  <li>
                    <div
                      onClick={() =>
                        navigate(
                          routes[RouteNames.SCOREBOARD_PERSONAL_PAGE].path
                        )
                      }
                    >
                      Personal
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() =>
                        navigate(routes[RouteNames.SCOREBOARD_GLOBAL_PAGE].path)
                      }
                    >
                      Global
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="tooltip tooltip-bottom tooltip-secondary"
          data-tip="Just for show too"
        >
          <div className="btn btn-ghost normal-case text-xl">ReAxion</div>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        {/* Desktop View */}
        <ul className="menu menu-horizontal px-1">
          <li>
            <div
              onClick={() => navigate(routes[RouteNames.SETTINGS_PAGE].path)}
            >
              Settings
            </div>
          </li>
          <li tabIndex={0}>
            <div>
              Leaderboards
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </div>
            <ul className="p-2 bg-base-100">
              <li>
                <div
                  onClick={() =>
                    navigate(routes[RouteNames.SCOREBOARD_PERSONAL_PAGE].path)
                  }
                >
                  Personal
                </div>
              </li>
              <li>
                <div
                  onClick={() =>
                    navigate(routes[RouteNames.SCOREBOARD_GLOBAL_PAGE].path)
                  }
                >
                  Global
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div
          className="btn btn-outline btn-primary"
          onClick={() => {
            navigate(routes[RouteNames.GAME_PAGE].path);
          }}
        >
          Get started
        </div>
      </div>
    </div>
  );
};
