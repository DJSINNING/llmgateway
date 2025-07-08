// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
var changelog = defineCollection({
  name: "changelog",
  directory: "src/content/changelog",
  include: "**/*.md",
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    date: z.string(),
    title: z.string(),
    summary: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number(),
      height: z.number()
    })
  })
});
var content_collections_default = defineConfig({
  collections: [changelog]
});
export {
  content_collections_default as default
};
