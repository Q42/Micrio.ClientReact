// filepath: src/test-setup/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Micrio from '..';

const App = () => (
  <Micrio
    id="dzzLm"
    style={{ margin: 0, padding: 0, width: '100%', height: '100vh', backgroundColor: 'black' }}
    onZoom={(event) => console.log('Zoom event triggered:', event)}
  />
);

// If using React 18+, you can use createRoot instead
createRoot(document.getElementById('root')!).render(<App />);
