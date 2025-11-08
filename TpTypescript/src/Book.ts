const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/myappdb')
  .then(() => console.log('MongoDB Connected'))
  .catch((err: any) => console.log('DB Connection Error:', err));

  
const bookSchema = new mongoose.Schema({
    id: Number,
    title: { type: String, required: true },
    author: { type: String, required: true },
    numberofpages: Number,
    status: { 
        type: String, 
        enum: ["Read", "Re-read", "DNF", "Currently reading", "Returned Unread", "Want to read"] 
    },
    price: Number,
    numberofpagesread: Number,
    format: { 
        type: String, 
        enum: ["Print", "PDF", "Ebook", "AudioBook"] 
    },
    suggestedby: String,
    finished: { type: Boolean, default: false }
});

const BookModel = mongoose.model('Book', bookSchema);

class Book {
    constructor(
        public id: number,
        public title: string,
        public author: string,
        public numberofpages: number,
        public status: "Read" | "Re-read" | "DNF" | "Currently reading" | "Returned Unread" | "Want to read",
        public price: number,
        public numberofpagesread: number,
        public format: "Print" | "PDF" | "Ebook" | "AudioBook",
        public suggestedby: string,
        public finished: boolean = false
    ) {}

    currentlyAt(): number {
        return this.numberofpagesread;
    }

    static async getAllBooks() {
        return await BookModel.find();
    }

    static async addBook(bookData: any) {
        const newBook = new BookModel(bookData);
        return await newBook.save();
    }

    static async deleteBook(id: string) {
        return await BookModel.findByIdAndDelete(id);
    }
}

module.exports = Book;