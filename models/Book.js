// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({  //Schema ile veritabanında saklanacak verinin nasıl görünmesi gerektiğini, hangi alanlara sahip olacağını, hangi veri türlerini barındıracağını ve hangi kısıtlamaların uygulanacağını belirleriz.
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: String,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
