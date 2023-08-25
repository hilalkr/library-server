const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { createBook, getAllBooks, getBookById, updateBook, deleteBook, borrowBook, returnBook } = require('../controllers/bookController');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/books', getAllBooks); 
router.get('/books/:id', getBookById); 
router.post('/books', createBook); 
router.put('/books/:id', updateBook); 
router.delete('/books/:id', deleteBook); 

router.post('/books/:id/borrow', borrowBook); 
router.post('/books/:id/return', returnBook); 

module.exports = router;
