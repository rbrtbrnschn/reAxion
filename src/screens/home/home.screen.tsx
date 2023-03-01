import { useStore } from "easy-peasy";
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
            <div className=" mt-5 relative bg-indigo-700 mx-auto w-5/6 py-10 rounded-lg">

                <div className="">
                    <h1 className="text-white m-auto w-max md:text-4xl text-2xl font-bold uppercase">Know your milliseconds</h1>
                    <p className="text-white m-auto w-max md:text-2xl text-xl">Milliseconds from red to green... guess and get good</p>
                </div>
                <div className="p-5 bg-white bg-opacity-20 border-white border-2 rounded-lg w-2/5 m-3 ml-10">
                    <h2 className="text-white opacity-100 font-bold md:text-3xl text-1xl text-center mb-5">Start Playing</h2>
                    <input className="p-4 mb-5 w-full rounded-lg" type="text" placeholder="Insert name" />
                    <button
                        onClick={handleQuickPlay}
                        className="transition duration-300 ease-in-out w-full hover:bg-opacity-70 hover:bg-white-100 lg:text-xl hover:border-white border bg-white bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-indigo-700	focus:ring-white rounded-lg text-indigo-700 px-4 sm:px-8 py-1 sm:py-3 text-sm mb-5"
                    >
                        Quick Play
                    </button>
                    <button
                        onClick={handleQuickPlay}
                        className="transition duration-300 ease-in-out w-full hover:bg-opacity-70 hover:bg-white-100 lg:text-xl hover:border-white border bg-white bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-indigo-700	focus:ring-white rounded-lg text-indigo-700 px-4 sm:px-8 py-1 sm:py-3 text-sm"
                    >
                        Select mode
                    </button>
                </div>
            </div>
        </div>
    );
}