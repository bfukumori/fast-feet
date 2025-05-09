import { resolve } from "node:path";
import swc from "unplugin-swc";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		root: "./",
		alias: {
			"@src": "./src",
			"@test": "./test",
		},
		coverage: {
			exclude: [
				...coverageConfigDefaults.exclude,
				"**/*.module.ts",
				"src/main.ts",
			],
		},
	},
	plugins: [
		swc.vite({
			module: { type: "es6" },
		}),
	],
	resolve: {
		alias: {
			src: resolve(__dirname, "./src"),
		},
	},
});
