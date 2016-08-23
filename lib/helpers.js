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

// var obj = {}
// return knex('meetups').where('id', meetupId).first().then(function(meetups){
//   obj.meetup = meetups
//   return knex('memberships').where('meetup_id', meetupId).pluck('user_id').then(function(members){
//     return knex.select().from('users').whereIn('id', members).then(function(people){
//       obj.members = people
//       return obj
//     })
//   })
// })

function getAuthorBooks(authorId) {
  var obj = {}
  return knex('authors').where('id', authorId).first().then(function(author){
    obj.author = author
    return knex('authors_books').where('author_id', author.id).pluck('book_id').then(function(bookId){
      return knex('books').whereIn('id', bookId).then(function(books){
        console.log(books);
        obj.book = books
        return obj
      })
    })
  })
  // your code here
}

function getBookAuthors(book) {
  // your code here
}



module.exports = {
  getAuthorBooks: getAuthorBooks,
  getBookAuthors: getBookAuthors
}
