import { useNavigate } from "react-router-dom";
import { NavComponent } from "../../components/navigation";
import { RouteNames } from "../../interfaces/route.interface";
import { routes } from "../../routes";

export const HomeScreen = () => {
    const navigate = useNavigate();

    const handleQuickPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
        navigate(routes[RouteNames.GAME_PAGE].path);
    };

    return (
        <div>
            <NavComponent />
            <div className="relative">
            <button
                onClick={handleQuickPlay}
                className="mx-3 hover:text-indigo-900 hover:bg-gray-100 lg:text-xl hover:border-white border bg-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-indigo-700	focus:ring-white rounded text-indigo-700 px-4 sm:px-8 py-1 sm:py-3 text-sm"
            >
                Quick Play
            </button>
            </div>
        </div>
    );
}