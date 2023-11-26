import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import katex from 'rehype-katex';
import math from 'remark-math';

export default defineConfig({
	site: 'https://blog.edoardob.im',
	redirects: {
		'/feed': '/feed.xml',
	},
	image: {
		remotePatterns: [{ protocol: 'https' }],
	},
	markdown: {
		shikiConfig: {
			theme: 'github-dark-dimmed',
			wrap: true,
		},
		remarkPlugins: [math],
		rehypePlugins: [katex],
	},
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		mdx(),
	],
});
