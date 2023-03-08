import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { Footer } from "../../components/footer";
import { Hero } from "../../components/hero";
import { Navbar } from "../../components/navbar";

const MyHomeScreen = () => {
  const navigate = useNavigate();

  return (
    <Screen className="flex flex-col">
      <Navbar />
      <Hero />
      <Footer />
    </Screen>
  );
};

export const HomeScreen = MyHomeScreen;

const Screen = styled.div`
  width: 100svw;
  height: 100svh;
`;
