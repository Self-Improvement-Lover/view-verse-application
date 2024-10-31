import { useState } from 'react';
import './App.css';
import { TMDBApiStreamingContentMetadataProvider } from './providers/tmdb-api-streaming-content-metadata-provider';

export default function App() {
  const provider = new TMDBApiStreamingContentMetadataProvider();
  async function onClick() {
    const provider = new TMDBApiStreamingContentMetadataProvider();
    const consoleResponse =
      await provider.getStreamingContentMetadata('lord of rings');
    console.log(consoleResponse);
  }

  return (
    <>
      <button onClick={onClick}>anime metadata test</button>
    </>
  );
}
