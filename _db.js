let books = [
    { id: "1", title: "Learning GraphQL", platform: ["Kindle", "Hardcover", "Paperback"] },
    { id: "2", title: "Advanced Node.js", platform: ["Hardcover", "eBook"] },
    { id: "3", title: "JavaScript Essentials", platform: ["Paperback", "eBook"] },
    { id: "4", title: "Mastering React", platform: ["Kindle", "Paperback"] },
    { id: "5", title: "Introduction to TypeScript", platform: ["Hardcover", "Kindle"] },
];

let authors = [
    { id: "1", name: "John Doe", verified: true },
    { id: "2", name: "Jane Smith", verified: false },
    { id: "3", name: "Alice Johnson", verified: true },
    { id: "4", name: "Robert Brown", verified: false },
    { id: "5", name: "Emily Davis", verified: true },
];

let reviews = [
    { id: "1", rating: 5, content: "Excellent book for beginners!", author_id: "1", book_id: "1" },
    { id: "2", rating: 4, content: "Very informative, but a bit dense.", author_id: "2", book_id: "2" },
    { id: "3", rating: 3, content: "Good concepts, but lacking examples.", author_id: "3", book_id: "3" },
    { id: "4", rating: 4, content: "Helpful for intermediate learners.", author_id: "4", book_id: "4" },
    { id: "5", rating: 5, content: "A must-read for advanced developers.", author_id: "5", book_id: "5" },
];

export default { books, authors, reviews }