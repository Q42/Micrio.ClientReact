# Micrio Client React Wrapper

[![NPM Version](https://img.shields.io/npm/v/@micrio/client-react.svg)](https://www.npmjs.com/package/@micrio/client-react)
[![License](https://img.shields.io/npm/l/@micrio/client-react.svg)](https://github.com/Q42/Micrio.ClientReact/blob/main/LICENSE)
[![React Version](https://img.shields.io/badge/React-%5E18.0.0-blue)](https://reactjs.org/)

[Micrio](https://micr.io/) is a platform for creating interactive, high-resolution image experiences. This NPM package (`@micrio/client-react`) provides a React component that wraps the core [Micrio Client JS library](https://www.npmjs.com/package/@micrio/client) ([Github](https://github.com/Q42/Micrio.Client)), making it easy to integrate Micrio viewers into your React applications.

It's fully Typescript-compatible, offering a great development experience for Typescript-React projects.

If you are looking for HOWTOs, tutorials, or general Micrio help, please check out our searchable [Knowledge Base](https://doc.micr.io/).

## Requirements

*   **Node.js:** `>=18.17.0`
*   **React:** `^18.0.0`
*   **React DOM:** `^18.0.0`

## Installation

```bash
npm i @micrio/client-react
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { Micrio } from '@micrio/client-react';

const App = () => {
	return (
		<div style={{ width: '800px', height: '600px' }}>
			<Micrio id="aBcDeFg" /> {/* Replace with your Micrio Image ID */}
		</div>
	);
};

export default App;
```

### Handling Events

You can pass event handlers directly as props. The available events are documented in the [Micrio Client Events documentation](https://doc.micr.io/client/v5/events.html).

```tsx
import React, { useCallback } from 'react';
import { Micrio } from '@micrio/client-react';

const App = () => {
	return (
		<div style={{ width: '800px', height: '600px' }}>
			<Micrio
				id="aBcDeFg"
				onShow={e => {
					const micrioInstance = e.detail;
					console.log('Micrio show', micrioInstance.$current?.camera.flyToCoo([0.5, 0.5]));
				}}
			/>
		</div>
	);
};

export default App;
```

### Initial Settings

Pass initial runtime settings as props. See the [Micrio Client Runtime Settings documentation](https://doc.micr.io/client/v5/settings.html) for all available options.

```tsx
import React from 'react';
import { Micrio } from '@micrio/client-react';

const App = () => {
	return (
		<div style={{ width: '800px', height: '600px' }}>
			<Micrio
				id="aBcDeFg" // Replace with your Micrio Image ID
				dataUi={false} // Example: Start with UI hidden
			/>
		</div>
	);
};

export default App;
```

## Component Props & API

The `<Micrio />` component accepts the following key props:

*   `id` (string, required): The Micrio Image ID.
*   `className` (string, optional): CSS class name for the container div.
*   `style` (object, optional): Inline styles for the container div. Defaults to `{ width: '100%', height: '100%' }`.
*   **Event Handlers:** Functions corresponding to Micrio client events (e.g., `onShow`, `onPreData`, `onZoom`, `onTourStart`). The `onShow` handler receives the `MicrioInstance` as its argument.
*   **Runtime Settings:** Most other props are passed directly to the Micrio client as initial runtime settings (e.g., `dataUi`, `dataLogo`, `dataPath`). Refer to the [Micrio documentation](https://doc.micr.io/client/v5/settings.html) for details.

### Important Note on Initial Settings Props!

Almost all Micrio-specific runtime props are applied only when the component **mounts**. The underlying Micrio client does not support dynamically changing most of these settings after initialization. If you need to change a setting like `dataUi` from `false` to `true`, you will need to **unmount and remount** the `<Micrio />` component with the new prop value. The `id` prop *can* be changed dynamically, which will load a new Micrio image. The `muted` prop can also be changed, muting/unmuting audio in the element.

## Contributing

Contributions are welcome! Please follow these steps:

1.  **Fork & Clone:** Fork the repository and clone it locally.
2.  **Install:** `npm install`
3.  **Develop:** Run the development server: `npm run dev` (available at `http://localhost:2000`)
4.  **Build:** Create a production build: `npm run build`
5.  **Submit PR:** Create a pull request with your changes. Please ensure Micrio still works well when running `npm run dev` and that the code is formatted correctly.

Feel free to open an issue for bug reports or feature requests.

## Repository

*   [https://github.com/Q42/Micrio.ClientReact](https://github.com/Q42/Micrio.ClientReact)

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
