import { resolve } from "node:path";
import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.e2e-spec.ts"],
		globals: true,
		root: "./",
		setupFiles: ["./test/setup-e2e.ts"],
		coverage: {
			include: ["src/infrastructure/mappers", "src/infrastructure/controllers"],
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
