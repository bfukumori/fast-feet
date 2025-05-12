import { resolve } from "node:path";
import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		root: "./",
		coverage: {
			include: ["src/application/use-cases", "src/domain"],
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
	},
	plugins: [
		tsConfigPaths(),
		swc.vite({
			module: { type: "es6" },
		}),
	],
	resolve: {
		alias: {
			"@src": resolve(__dirname, "./src"),
			"@test": resolve(__dirname, "./test"),
		},
	},
});
