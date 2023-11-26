import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@/consts';
import getSortedPosts from '@/utils/getSortedPosts';

export async function GET(context) {
	const posts = await getCollection('blog', ({ data }) => {
		return data.draft !== true;
	});
	const sortedPosts = getSortedPosts(posts, true);

	return rss({
		stylesheet: '/styles/feed.xsl',
		title: SITE.title,
		description: SITE.description,
		site: context.site,
		items: sortedPosts.map((post) => {
			const categories = post.data.tags
				.map((tag) => `<category><![CDATA[${tag}]]></category>`)
				.join(' ');
			return {
				title: post.data.title,
				pubDate: post.data.written,
				description: post.data.description,
				link: post.slug,
				customData: categories,
			};
		}),
	});
}
