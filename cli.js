import inquirer from 'inquirer';
import { request, gql } from 'graphql-request';

// GraphQL server URL
const GRAPHQL_URL = 'http://localhost:4000/';

//User Accounts
const users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'howard', password: '12345678', role: 'user' },
];

// Function to authenticate users
async function login() {
    const { username, password } = await inquirer.prompt([
        { type: 'input', name: 'username', message: 'Enter username:' },
        { type: 'password', name: 'password', message: 'Enter password:', mask: '*' },
    ]);

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        console.log('Invalid credentials.');
        return null;
    }

    console.log(`Welcome, ${user.username}!`);
    return user;
}

// Function Display Book
async function viewBooks() {
    const query = gql`
        query {
            books {
                id
                title
                platform
            }
        }
    `;
    const data = await request(GRAPHQL_URL, query);
    console.table(data.books);
}

// Function Add Book
async function addBook() {
    const { title, platform } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter book title:' },
        { type: 'input', name: 'platform', message: 'Enter platforms (comma-separated):' },
    ]);

    const mutation = gql`
        mutation AddBook($book: AddBookInput!) {
            addBook(book: $book) {
                id
                title
                platform
            }
        }
    `;

    const variables = {
        book: {
            title,
            platform: platform.split(',').map(p => p.trim()),
        },
    };

    const data = await request(GRAPHQL_URL, mutation, variables);
    console.log('Book added successfully:', data.addBook);
}

// Function Delete Book
async function deleteBook() {
    const { bookId } = await inquirer.prompt([
        { type: 'input', name: 'bookId', message: 'Enter book ID to delete:' },
    ]);

    const mutation = gql`
        mutation DeleteBook($id: ID!) {
            deleteBook(id: $id) {
                id
                title
            }
        }
    `;

    const variables = { id: bookId };
    const data = await request(GRAPHQL_URL, mutation, variables);
    console.log('Remaining books:', data.deleteBook);
}

// MENU for CLI
async function mainMenu(user) {
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Choose an action:',
                choices: [
                    'View Books',
                    ...(user.role === 'admin' ? ['Add Book', 'Delete Book'] : []),
                    'Logout',
                ],
            },
        ]);

        if (action === 'View Books') {
            await viewBooks();
        } else if (action === 'Add Book') {
            await addBook();
        } else if (action === 'Delete Book') {
            await deleteBook();
        } else if (action === 'Logout') {
            console.log('Logged out.');
            break;
        }
    }
}

// Home Page
(async () => {
    console.log('Welcome to the Book Management CLI System!');
    const user = await login();
    if (user) {
        await mainMenu(user);
    }
})();
