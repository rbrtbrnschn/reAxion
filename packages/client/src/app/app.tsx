import styled from 'styled-components';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from '../routes';

const StyledApp = styled.div`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`;

export function App() {
  useEffect(() => {
    console.log(`${process.env.REACT_APP_API_URL ?? ''}
  /api/game/overview?userId=${'userId'}`);
  }, []);
  return (
    <Routes>
      {Object.entries(routes).map(([key, route]) => (
        <Route {...route} key={'route-' + key} />
      ))}
    </Routes>
  );
}

export default App;
