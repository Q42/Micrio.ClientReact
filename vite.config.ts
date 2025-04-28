import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.tsx'),
			name: 'MicrioClientReact',
			fileName: (format) => `index.${format}.js`,
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			// Make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['react', 'react-dom', '@micrio/client'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'@micrio/client': 'Micrio', // Assuming @micrio/client exposes a global 'Micrio' if used in UMD
				},
			},
		},
		sourcemap: true,
		// Reduce bloat from legacy polyfills.
		target: 'esnext',
		// Leave minification up to the consumer.
		minify: false,
	},
	// Define the entry point for the dev server
	server: {
		open: '/src/dev/index.html',
	},
});