import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { TMDBApiStreamingContentMetadataProvider } from './providers/tmdb-api-streaming-content-metadata-provider';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(App, { streamingContentMetadataProvider: new TMDBApiStreamingContentMetadataProvider() }) }));
