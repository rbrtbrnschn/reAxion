import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './main.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from 'easy-peasy';
import App from './app/app';
import { GameManagerProvider } from './contexts/game-manager.context';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient();
root.render(
  <GameManagerProvider>
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StoreProvider>
  </GameManagerProvider>
);
