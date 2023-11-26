import type { CollectionEntry } from "astro:content";

const getPostsWithTag = (posts: CollectionEntry<"blog">[], tag: string, sortByDate: boolean = false) => {
    const filteredPosts = posts.filter(post => post.data.tags.includes(tag));
    return sortByDate ? filteredPosts.sort((a, b) => {
        return b.data.written.getTime() - a.data.written.getTime();
    }) : filteredPosts;
};

export default getPostsWithTag;