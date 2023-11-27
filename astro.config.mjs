import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeExternalLinks from 'rehype-external-links';

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
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeExternalLinks, rehypeKatex],
	},
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		mdx(),
	],
});
