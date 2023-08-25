const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const app = express();
const getBooks = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token){
      return res.status(403).json({
        message: 'Yetkisiz Erişim!'
      })
    }

    jwt.verify(token, 'my_super_secret_key_123', async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Token geçersiz veya süresi dolmuş!'
        });
      }

      // Token is valid, proceed with fetching books
      const books = await Book.find({});
      return res.status(200).json({
        data: books
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
}

const borrowBook = async (req, res) => {
  try {
    const { userId } = req.body;
    const bookId = req.params.id; //params: steklerdeki URL parametrelerine erişim sağlar. /books/:id şeklinde bir yol şablonuyla tüm kitaplar için tek bir rota oluşturabilir ve id parametresini kullanarak her kitabın benzersiz kimliğini alabiliriz.

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // Kitap ödünç alma işlemi

    res.status(200).json({ message: 'Book borrowed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while borrowing the book.' });
  }
};

const returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // Kitap iade işlemi

    res.status(200).json({ message: 'Book returned successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while returning the book.' });
  }
};



const createBook = async (req, res) => {
  try {
    const { title, author, genre, ISBN } = req.body;
    //const createdBy = req.user.id; // Oturum açmış kullanıcının ID'si
    const newBook = new Book({
      title,
      author,
      genre,
      ISBN,
      createdBy: "dfasfds"
    });

    const savedBook = await newBook.save();

    if (!savedBook) {
      return res.status(404).json({ error: 'Book could not be created.' });
    }

    res.status(201).json({ message: 'Book created successfully.', data: savedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the book.' });
  }
};

console.log();

//READ


const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'error.' });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};

//UPDATE
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, genre } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, genre },
      { new: true } // Yeni güncellenmiş kitabı döndürmesi için
    );
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the book.' });
  }
};
//DELETE
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the book.' });
  }
};


const checkDelayedBooks = async () => {
  try {
    const currentDate = new Date();
    const borrowedBooks = await Book.find({ borrowedBy: { $exists: true } });

    for (const book of borrowedBooks) {
      if (book.dueDate < currentDate) {
        const user = await User.findById(book.borrowedBy);
        console.log(`Reminder: The book "${book.title}" is overdue for user "${user.name}".`);
      }
    }
  } catch (error) {
    console.error('An error occurred while checking delayed books:', error);
  }
};

module.exports = {createBook,getAllBooks,getBookById, updateBook, deleteBook, getBooks, borrowBook, returnBook, checkDelayedBooks };
