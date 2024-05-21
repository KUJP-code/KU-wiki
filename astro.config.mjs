import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "KU-Docs",
			customCss: ["./src/tailwind.css"],
			social: {
				github: "https://github.com/Brett-Tanner/KU-wiki",
			},
			favicon: "/favicon.svg",
			sidebar: [
				{
					label: "Guides",
					collapsed: true,
					autogenerate: { directory: "guides" },
				},
				{
					label: "Materials Site",
					collapsed: true,
					autogenerate: { directory: "materials" },
				},
				{
					label: "Event Site",
					collapsed: true,
					items: [
						{
							label: "Overview",
							link: "/event/1_overview",
						},
						{
							label: "Resources",
							collapsed: true,
							autogenerate: { directory: "/event/resources" },
						},
						{
							label: "Processes",
							collapsed: true,
							autogenerate: { directory: "/event/processes" },
						},
						{
							label: "AWS",
							collapsed: true,
							autogenerate: { directory: "/event/aws" },
						},
					],
				},
				{
					label: "Setsumeikai Calendar",
					collapsed: true,
					autogenerate: { directory: "setsumeikai" },
				},
				{
					label: "Tech Stack",
					collapsed: true,
					autogenerate: { directory: "stack" },
				},
			],
		}),
		tailwind({
			applyBaseStyles: false,
		}),
	],
});
