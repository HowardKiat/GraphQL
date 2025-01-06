import inquirer from 'inquirer';
import { request, gql } from 'graphql-request';

// GraphQL server URL
const GRAPHQL_URL = 'http://localhost:4000/';

// User Accounts
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

// Function to view books
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

// Function to add a book
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

// Function to delete a book
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

async function updateBook() {
    const { bookId } = await inquirer.prompt([
        { type: 'input', name: 'bookId', message: 'Enter book ID to edit:' }
    ]);

    const { fieldToEdit } = await inquirer.prompt([
        {
            type: 'input',
            name: 'fieldToEdit',
            message: 'Which field would you like to edit? (Enter 1 for Title, 2 for Platform):',
            validate: (input) => {
                const num = parseInt(input);
                if (isNaN(num) || num < 1 || num > 2) {
                    return 'Please enter 1 for Title or 2 for Platform.';
                }
                return true;
            }
        }
    ]);

    let mutation;
    let variables = {
        id: bookId,
        edits: {}
    };

    if (fieldToEdit === '1') {
        const { newTitle } = await inquirer.prompt([
            { type: 'input', name: 'newTitle', message: 'Enter new book title:' }
        ]);

        if (!newTitle.trim()) {
            console.log('Title cannot be empty.');
            return;
        }

        variables.edits.title = newTitle.trim();

    } else if (fieldToEdit === '2') {
        const { newPlatform } = await inquirer.prompt([
            { type: 'input', name: 'newPlatform', message: 'Enter new platform(s) (comma-separated):' }
        ]);

        const platforms = newPlatform.split(',').map(p => p.trim()).filter(p => p);
        if (platforms.length === 0) {
            console.log('Platforms cannot be empty.');
            return;
        }

        variables.edits.platform = platforms;
    }

    mutation = gql`
        mutation UpdateBook($id: ID!, $edits: EditBookInput!) {
            updateBook(id: $id, edits: $edits) {
                id
                title
                platform
            }
        }
    `;

    try {
        const data = await request(GRAPHQL_URL, mutation, variables);
        if (data.updateBook) {
            console.log('Book updated successfully:', data.updateBook);
        } else {
            console.log('Failed to update book. Book might not exist.');
        }
    } catch (error) {
        console.error('Error updating book:', error.message);
    }
}
// MENU for CLI
async function mainMenu(user) {
    while (true) {
        console.log('\nChoose an action:');
        const options = [
            'View Books',
            ...(user.role === 'admin' ? ['Add Book', 'Delete Book', 'Edit Book'] : []),
            'Logout',
        ];

        options.forEach((option, index) => {
            console.log(`${index + 1}. ${option}`);
        });

        const { actionNumber } = await inquirer.prompt([
            {
                type: 'input',
                name: 'actionNumber',
                message: 'Enter the number of your choice:',
                validate: (input) => {
                    const num = parseInt(input);
                    if (isNaN(num) || num < 1 || num > options.length) {
                        return `Please enter a valid number between 1 and ${options.length}.`;
                    }
                    return true;
                },
            },
        ]);

        const actionIndex = parseInt(actionNumber) - 1;
        const action = options[actionIndex];

        if (action === 'View Books') {
            await viewBooks();
        } else if (action === 'Add Book') {
            await addBook();
        } else if (action === 'Edit Book') {
            await updateBook();
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
