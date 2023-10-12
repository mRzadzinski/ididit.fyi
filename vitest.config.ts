import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		globals: true,
		environment: 'jsdom'
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib'),
			$components: path.resolve(__dirname, './src/components'),
			$app: path.resolve(__dirname, './node_modules/@sveltejs/kit/src/runtime/app')
		}
	}
});
