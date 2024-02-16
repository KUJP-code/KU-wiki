import starlightPlugin from "@astrojs/starlight-tailwind";

// Generated color palettes
const accent = {
	200: "#f4bb8c",
	600: "#9d5800",
	900: "#4c2800",
	950: "#381c00",
};
const gray = {
	100: "#eff8fb",
	200: "#dff2f7",
	300: "#b0c7cd",
	400: "#6694a0",
	500: "#32606b",
	700: "#0e3f49",
	800: "#002c35",
	900: "#081b20",
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: { accent, gray },
		},
	},
	plugins: [starlightPlugin()],
};
