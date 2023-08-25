require('dotenv').config();
const connectDB = require('./utils/db');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { checkDelayedBooks } = require('./controllers/bookController');
const cors = require('cors');
const router = require('./routes')




const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017';

connectDB (MONGODB_URI)

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // İzin verilecek alan adını belirtin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilecek HTTP metotlarını belirtin
}));

app.use(router)

// Express route'larını tanımlama
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Her gün saat 00:00'da geciken kitapları kontrol etme
cron.schedule('0 0 * * *', () => {
  checkDelayedBooks();
});

const jwt = require('jsonwebtoken');

// ...



// Kimlik doğrulama işlemini gerçekleştiren middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }

    req.user = user; // Kimlik doğrulamasını geçen kullanıcı bilgilerini request nesnesine ekle
    next();
  });
};

// Kitap oluşturma route'ını tanımlama
app.post('/books', authenticateJWT, async (req, res) => {
  try {
    const { title, author, genre, id, ISBN } = req.body;
    const createdBy = req.user.id; // Oturum açmış kullanıcının ID'si

    const newBook = new Book({
      title,
      author,
      genre,
      id,
      ISBN,
      createdBy,
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
});


