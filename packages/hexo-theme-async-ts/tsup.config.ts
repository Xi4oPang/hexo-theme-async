import { defineConfig } from 'tsup';

export default defineConfig(options => {
	return {
		entry: ['src/main.ts'],
		splitting: false,
		sourcemap: false,
		clean: true,
		format: ['iife'],
		target: 'es2018',
		outExtension() {
			return {
				js: '.js',
			};
		},
		platform: 'browser',
		minify: !options.watch,
		outDir: '../hexo-theme-async/source/js/',
	};
});
