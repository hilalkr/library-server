// routes/bookRoutes.js
const express = require('express');
const {createBook, borrowBook, returnBook } = require('../controllers/bookController');
const Book = require('../models/Book'); // Book modelini import edin

const router = express.Router();


router.get('/books', async (req, res) => {
  try {
    const books = await Book.find(); // Veritabanından kitapları çekme
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/borrow', borrowBook); 
router.post('/:id/return', returnBook); 
router.get('/books', createBook);

module.exports = router;
