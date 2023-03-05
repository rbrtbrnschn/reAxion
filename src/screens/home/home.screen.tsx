import { useStore } from "easy-peasy";
import { useNavigate } from "react-router-dom";
import { NavComponent } from "../../components/navigation";
import { RouteNames } from "../../interfaces/route.interface";
import { routes } from "../../routes";
import { Screen } from "../../components/common";
import { withNavigation } from "../../components/v2/navigation";
import { Navbar } from "../../components/v2/navbar";
import { Hero } from "../../components/v2/hero";
import { Footer } from "../../components/v2/footer";

const MyHomeScreen = () => {
  const navigate = useNavigate();

  const handleQuickPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(routes[RouteNames.GAME_PAGE].path);
  };

  return (
    <Screen className="flex flex-col">
      <Navbar />
      <Hero />
      <Footer />
    </Screen>
  );
};

export const HomeScreen = MyHomeScreen;
