import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  integrations: [
    starlight({
      title: "KU-Docs",
      social: {
        github: "https://github.com/Brett-Tanner/KU-wiki",
      },
      favicon: "/public/favicon.svg",
      sidebar: [
        {
          label: "Guides",
          collapsed: true,
          autogenerate: { directory: "guides" },
        },
        {
          label: "Registration Site",
          collapsed: true,
          items: [
            {
              label: "Overview",
              collapsed: true,
              link: "/registration_overview",
            },
            {
              label: "AWS",
              collapsed: true,
              autogenerate: { directory: "aws" },
            },
            {
              label: "Controllers",
              collapsed: true,
              autogenerate: { directory: "controllers" },
            },
            {
              label: "Models",
              collapsed: true,
              autogenerate: { directory: "models" },
            },
            {
              label: "Views",
              collapsed: true,
              autogenerate: { directory: "views" },
            },
          ],
        },
        {
          label: "Setsumeikai Calendar",
          collapsed: true,
          autogenerate: { directory: "setsumeikai" },
        },
      ],
    }),
  ],
});
