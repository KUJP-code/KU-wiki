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
      title: "KidsUP Wiki",
      social: {
        github: "https://github.com/Brett-Tanner/KU-wiki",
      },
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "AWS",
          autogenerate: { directory: "aws" },
        },
        {
          label: "Controllers",
          autogenerate: { directory: "controllers" },
        },
        {
          label: "Models",
          autogenerate: { directory: "models" },
        },
        {
          label: "Rails",
          autogenerate: { directory: "rails" },
        },
        {
          label: "Setsumeikai Calendar",
          autogenerate: { directory: "setsumeikai" },
        },
        {
          label: "Views",
          autogenerate: { directory: "views" },
        },
      ],
    }),
  ],
});
