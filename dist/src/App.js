import { jsx as _jsx } from "react/jsx-runtime";
import './App.css';
import { Home } from './components/home';
export function App({ streamingContentMetadataProvider }) {
    return _jsx(Home, { streamingContentMetadataProvider: streamingContentMetadataProvider });
}
export const AppTestIds = {
    home: 'app-test-id-home'
};
