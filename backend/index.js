
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 4000;

let books = [
    {
        "id": "1473763200",
        "title": "The Hidden Life of Trees",
        "author": "Peter Wohlleben",
        "publishedDate": "13/09/2016",
        "summary": "In this enlightening book, forester Peter Wohlleben shares his deep observations and scientific findings about trees. He reveals their complex social networks, how they communicate, and their remarkable ability to care for their young and sick. Wohlleben's narrative is both scientifically fascinating and deeply emotional, offering a new perspective on the world of trees."
    },
    {
        "id": "1602566400",
        "title": "Braiding Sweetgrass",
        "author": "Robin Wall Kimmerer",
        "publishedDate": "13/10/2020",
        "summary": "Robin Wall Kimmerer, a botanist and member of the Citizen Potawatomi Nation, weaves together indigenous wisdom and scientific knowledge in this profound exploration of the natural world. Through her essays, Kimmerer invites readers to reconsider their relationship with nature, advocating for a reciprocal relationship with plants and the Earth. Her poetic writing style and deep insights make this book a transformative read."
    },
    {
        "id": "1565125760",
        "title": "The Overstory",
        "author": "Richard Powers",
        "publishedDate": "02/04/2019",
        "summary": "Richard Powers' novel 'The Overstory' intertwines the lives of individuals who are brought together by their deep connection to trees and forests. Through diverse narratives, Powers explores humanity's impact on the environment and the profound influence of trees on our lives. This Pulitzer Prize-winning novel is a powerful reflection on the beauty and fragility of our natural world."
    }
];

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books Lib',
            version: '1.0.0',
            description: 'A simple API to manage books',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
        ],
    },
    apis: [__filename], // Use __filename to reference the current file
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         publishedDate:
 *           type: string
 *         summary:
 *           type: string
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve all books
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
app.get('/api/books', (req, res) => {
    res.status(200).send(books);
});

/**
 * @swagger
 * /api/books/{search}:
 *   get:
 *     summary: Retrieve books based on search term
 *     parameters:
 *       - in: path
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to filter books
 *     responses:
 *       200:
 *         description: A list of books matching the search term
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
app.get('/api/books/:search', (req, res) => {
    const search = req.params.search.toLowerCase();
    const filteredBooks = books.filter((book) => {
        const bookDataString = Object.values(book).join(' ').toLowerCase();
        return bookDataString.includes(search);
    });
    res.status(200).send(filteredBooks);
});

/**
 * @swagger
 * /api/deled/{id}:
 *   delete:
 *     summary: Delete a book by ID 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: The updated list of books after deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

app.get('/api/deled/:id', (req, res) => {    
    const bookId = req.params.id;
    console.log(bookId)
    books = books.filter((book) => book.id !== bookId);
    res.status(200).send(books);
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add or update a book | Node for every new document is is NULL and for new document it is assigned in the backend logic from timeStamp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The updated list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
app.post('/api/books', (req, res) => {
    const data = req.body;
    if (data.id && data.title && data.author && data.summary) {
        const index = books.findIndex(book => book.id === data.id);
        if (index !== -1) {
            books[index] = data;
        } 
        res.status(200).send(books);
        
    } else if (data.title && data.author && data.summary) {
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const saveData = {
            id: String(timestamp),
            title: data.title,
            author: data.author,
            summary: data.summary,
            publishedDate: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        };
        books.push(saveData);
        res.status(200).send(books);
    } else {
        res.status(400).send('Invalid data format');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
