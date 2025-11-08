const express = require('express');
const Book = require('./Book');
const path = require('path');


const app = express();

app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, '../src'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/addbook', (req: any, res: any) => {
    res.sendFile(path.resolve(__dirname, '../src/add.html'));
});

app.get('/books', async (req: any, res: any) => {
    const books = await Book.getAllBooks();
    
    const totalBooksRead = books.filter((book: any) => book.finished).length;
    const totalPages = books.reduce((sum: number, book: any) => sum + (book.numberofpagesread || 0), 0);
    
    res.render('index', { 
        books: books || [], 
        totalBooksRead: totalBooksRead || 0, 
        totalPages: totalPages || 0
    });
});

app.post('/add', async (req: any, res: any) => {
    const pagesRead = parseInt(req.body.pagesRead) || 0;
    const totalPages = parseInt(req.body.numberOfPages);
    const isFinished = pagesRead >= totalPages;

    await Book.addBook({
        title: req.body.title,
        author: req.body.author,
        numberofpages: totalPages,
        status: req.body.status,
        price: parseFloat(req.body.price) || 0,
        numberofpagesread: pagesRead,
        format: req.body.format,
        suggestedby: req.body.suggestedBy,
        finished: isFinished
    });
    
    res.redirect('/books');
});

app.get('/delete/:id', async (req: any, res: any) => {
    try {
        await Book.deleteBook(req.params.id);
        res.redirect('/books');
    } catch (error) {
        res.status(500).send('Error deleting book');
    }
});

app.listen(5000);