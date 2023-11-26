export type Site = {
    website: string;
    description: string;
    title: string;
    author: string;
    authorBio: string;
};

export type NavItems = {
    path: string;
    label: string;
    show: boolean;
}[];