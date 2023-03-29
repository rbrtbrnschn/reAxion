import styled from 'styled-components';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import { routes } from '../routes';

const StyledApp = styled.div`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`;

export function App() {
  useEffect(() => {
    const socket = io('http://localhost:8080');
    socket.on('connect', function () {
      console.log('Connected');

      socket.emit('match', { test: 'test' }, (data: any) => {
        console.log(data);
      });
      // socket.emit('identity', 0, (response: any) =>
      //   console.log('Identity:', response)
      // );
    });
    socket.on('match', function (data) {
      console.log('match', data);
    });
    // socket.on('exception', function (data) {
    //   console.log('event', data);
    // });
    socket.on('disconnect', function () {
      console.log('Disconnected');
    });

    return () => {
      socket.disconnect();
    };
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
