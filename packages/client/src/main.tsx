import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './main.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app/app';
import { GameManagerProvider } from './contexts/game-manager.context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient();
root.render(
  <GameManagerProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </GameManagerProvider>
);
