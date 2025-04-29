import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Micrio } from '..';
import { HTMLMicrioElement } from '@micrio/client';

const App = () => {
	const [turnOnPanStart, setTurnOnPanStart] = React.useState(false);

	const micrioRef = React.useRef<HTMLMicrioElement>(null);

	useEffect(() => {
		console.log('Micrio ref:', micrioRef.current);
	}, []);

	return (
		<div>
			<Micrio
				id="dzzLm"
				style={{ margin: 0, padding: 0, width: '100%', height: '100vh', backgroundColor: 'black' }}
				className="my-micrio-class"
				onZoom={e => console.log('Zoom event triggered:', e)}
				onShow={e => {
					const micrioInstance = e.detail;
					console.log('Micrio show', micrioInstance.$current?.camera.flyToCoo([0.5, 0.5]))
				}}
				dataSocial={false}
				onPanstart={turnOnPanStart ? e => console.log('Panstart event triggered:', e) : undefined}
				dataLogo={true}
				ref={micrioRef}
			/>
			<button onClick={() => setTurnOnPanStart(!turnOnPanStart)} style={{ position: 'absolute', bottom: 72, left: 24 }}>
				{turnOnPanStart ? 'Turn Off Panstart' : 'Turn On Panstart'}
			</button>
		</div>
	);
};

createRoot(document.getElementById('root')!).render(<App />);
