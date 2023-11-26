import type { CollectionEntry } from "astro:content";

const getSortedPosts = (allPosts: CollectionEntry<"blog">[], reverse: boolean = false) => {
    const posts = 
    allPosts
        .filter(({ data }) => import.meta.env.PROD ? data.draft !== true : true)
        .sort((a, b) => a.data.written.valueOf() - b.data.written.valueOf());
    
    return reverse ? posts.reverse() : posts;
}

export default getSortedPosts;