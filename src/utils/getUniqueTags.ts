import type { CollectionEntry } from "astro:content";

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
    const filteredPosts = posts.filter(({ data }) => !data.draft);
    const tagsSet = new Set<string>();

    filteredPosts.flatMap((post) => post.data.tags).forEach((tag) => tagsSet.add(tag));

    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
};

export default getUniqueTags;