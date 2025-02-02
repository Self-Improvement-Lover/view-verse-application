
import './App.css';
import { StreamingContentMetadataProvider } from './providers/streaming-content-metadata-provider';
import { Home } from './components/home';


type AppProps = {
  streamingContentMetadataProvider: StreamingContentMetadataProvider
}

export function App({ streamingContentMetadataProvider }: AppProps) {
  return <Home streamingContentMetadataProvider={streamingContentMetadataProvider} />;
}


export const AppTestIds = {
  home: 'app-test-id-home'
}






