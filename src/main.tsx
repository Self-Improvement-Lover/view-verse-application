import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {App} from './App.tsx';
import './index.css';
import { TMDBApiStreamingContentMetadataProvider } from './providers/tmdb-api-streaming-content-metadata-provider.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App streamingContentMetadataProvider={new TMDBApiStreamingContentMetadataProvider()} />
  </StrictMode>,
);
