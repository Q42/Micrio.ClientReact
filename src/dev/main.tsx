import React from 'react';
import { createRoot } from 'react-dom/client';
import Micrio from '..';

const App = () => {
  const [turnOnPanStartAndSocial, setTurnOnPanStartAndSocial] = React.useState(false);

  return (
    <div>
      <Micrio
        id="dzzLm"
        style={{ margin: 0, padding: 0, width: '100%', height: '100vh', backgroundColor: 'black' }}
        onZoom={e => console.log('Zoom event triggered:', e)}
        dataSocial={turnOnPanStartAndSocial ? true : false}
        onPanstart={turnOnPanStartAndSocial ? e => console.log('Panstart event triggered:', e) : undefined}
        dataLogo={false}
      />
      <button onClick={() => setTurnOnPanStartAndSocial(!turnOnPanStartAndSocial)} style={{ position: 'absolute', bottom: 72, left: 24 }}>
        {turnOnPanStartAndSocial ? 'Turn Off Panstart and Logo' : 'Turn On Panstart and Logo'}
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
