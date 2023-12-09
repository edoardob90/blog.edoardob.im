import { defineCollection, z } from "astro:content";

const blog = defineCollection({
	type: 'content',
	// Type-check front-matter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		tags: z.array(z.string()).default([]),
		// Transform string to Date object
		written: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updated: z
			.string()
			.optional()
			.transform((str: string | undefined) => (str ? new Date(str) : undefined)),
		draft: z.boolean().optional().default(false),
		excerpt: z.string().optional(),
	}),
});

export const collections = {
	'blog': blog,
};