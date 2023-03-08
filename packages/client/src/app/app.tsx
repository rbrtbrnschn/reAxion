import styled from 'styled-components';

import { common } from '@reaxion/common';
import { Route, Routes } from 'react-router-dom';
import { routes } from '../routes';

const StyledApp = styled.div`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`;

export function App() {
  const name = common();
  return (
    <Routes>
      {Object.entries(routes).map(([key, route]) => (
        <Route {...route} key={'route-' + key} />
      ))}
    </Routes>
  );
}

export default App;
