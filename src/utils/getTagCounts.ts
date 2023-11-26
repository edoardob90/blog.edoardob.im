import type { CollectionEntry } from "astro:content";

const createTally = (items: string[], sort: boolean = false): undefined | { name: string, count: number }[] => {
    if (!items) return;
    let tally = new Map<string, number>();
    
    items.forEach(key => {
        tally.set(key, (tally.get(key) ?? 0) + 1)
    })
    
    if (sort) tally = new Map([...tally.entries()].sort((a, b) => b[1] - a[1]));
    
    return Array.from(tally, ([name, count]) => ({ name, count }));
}

const getTagCounts = (posts: CollectionEntry<"blog">[]) => {
    const filteredPosts = posts.filter(post => !post.data.draft);
    
    const tagCounts = createTally(filteredPosts.flatMap(post => post.data.tags), true);
    
    return tagCounts;
}

export default getTagCounts;