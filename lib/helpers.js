var Promise = require('bluebird');
var knex = require('../db/knex');

function Authors() {
  return knex('authors');
}

function Books(){
  return knex('books');
}

function Authors_Books() {
  return knex('authors_books');
}

function prepIds(ids) {
  return ids.filter(function (id) {
    return id !== '';
  })
}

function insertIntoAuthorsBooks(bookIds, authorId) {
  bookIds = prepIds(bookIds);
  return Promise.all(bookIds.map(function (book_id) {
    book_id = Number(book_id)
    return Authors_Books().insert({
      book_id: book_id,
      author_id: authorId
    })
  }))
}

function getAuthorBooks(authorId) {
  var obj = {}
  return knex('authors').where('id', authorId).first().then(function(author){
    obj.author = author
    return knex('authors_books').where('author_id', authorId).pluck('book_id').then(function(bookId){
      return knex('books').whereIn('id', bookId).then(function(books){
        obj.book = books
        return obj
      })
    })
  })
}

function getBookAuthors(bookId) {
  var obj = {}
  return knex('books').where('id', bookId).first().then(function(book){
    obj.book = book
    return knex('authors_books').where('book_id', bookId).pluck('author_id').then(function(authorIds){
      return knex('authors').whereIn('id', authorIds).then(function(authors){
        obj.authors = authors
        return obj
      })
    })
  })
}



module.exports = {
  getAuthorBooks: getAuthorBooks,
  getBookAuthors: getBookAuthors
}
