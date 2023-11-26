// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { NavItems, Site } from './types';

export const SITE: Site = {
    title: 'Bald Notes',
    website: 'https://blog.edoardob.im',
    description: "Hi, welcome! I'm Edoardo, this is my personal blog, a home-made corner of the internet that aims to be my digital garden.",
    author: 'Edoardo Baldi',
    authorBio: "Mountain wanderer and hiker. Physicist with a love for tech. Cinema and book buff. Seeking adventure and knowledge through every experience.",
}

export const LOGO_IMAGE = {
    show: true,
    format: 'image/jpeg',
    width: 80,
    height: 80,
}

export const NAV_ITEMS: NavItems = [
    {
        path: '/',
        label: '🏕️ Home',
        show: true
    },
    {
        path: '/about',
        label: '👋🏻 About',
        show: true
    },
    {
        path: '/tags',
        label: '🏷️ Tags',
        show: true
    },
    {
        path: '/feed',
        label: '📰 RSS',
        show: true,
    }
]