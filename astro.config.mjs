import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
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
          label: "Rails",
          autogenerate: { directory: "rails" },
        },
        {
          label: "Models",
          autogenerate: { directory: "models" },
        },
        {
          label: "Controllers",
          autogenerate: { directory: "controllers" },
        },
        {
          label: "Views",
          autogenerate: { directory: "views" },
        },
      ],
    }),
  ],
});
