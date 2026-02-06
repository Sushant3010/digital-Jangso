export interface LibraryItem {
    id: number;
    title: string;
    category: 'To Cook' | 'To Watch' | 'To Visit' | 'To Read' | 'To Listen';
    link: string;
    imageUrl: string;
    note: string;
}

export const myItems: LibraryItem[] = [
    {
        id: 1,
        title: "Netflix X BTS",
        category: "To Watch",
        link: "https://www.netflix.com/in/title/82158609",
        imageUrl: "https://preview.redd.it/bts-5th-album-arirang-online-cover-image-v0-3nffe6fxmjdg1.jpeg?width=640&crop=smart&auto=webp&s=b02c46032cea3e301472002d042650f875fef7bb",
        note: "BTS on Netflix Yayyyyy!!!"
    },
    {
        id: 2,
        title: "Akshardham Temple",
        category: "To Visit",
        link: "https://www.gujarattourism.com/central-zone/gandhinagar/akshardham-temple.html",
        imageUrl: "https://www.gujarattourism.com/content/dam/gujrattourism/images/religious-sites/akshardham-temple/Akshardham-Temple-Banner.jpg",
        note: "Must Visit"
    },
    {
        id: 3,
        title: "Love on the Brain",
        category: "To Read",
        link: "https://files.addictbooks.com/wp-content/uploads/2023/09/Love-on-the-Brain.pdf",
        imageUrl: "https://assets.penguinrandomhouse.com/wp-content/uploads/2022/07/08132143/excerpts-Articles-Ali-Hazelwood-1200x-628.jpg",
        note: "If you have not read it yet then give it a try."
    }
];