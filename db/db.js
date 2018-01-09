const pgp = require('pg-promise')()

const connection = process.env.DATABASE_URL || 'postgres:///bookstore'
const db = pgp(connection)

// CREATE one book - return custom error message to view if constraint not met
const createBook = (bookToAdd) => {
  const {
    title, authorLast, authorFirst, genre, price, publisher, isbn, image
  } = bookToAdd
  const addThisBook = 'INSERT INTO books(title, author_last, author_first, genre, price, publisher, isbn, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
  return db.one(addThisBook, [title, authorLast, authorFirst, genre, price, publisher, isbn, image])
    .then(thisBookAdded => thisBookAdded)
    .catch(err => err.message)
}

// READ all books
const readAllBooks = (limit, offset) => {
  const getAllBooks = 'SELECT * FROM books ORDER BY title ASC LIMIT $1 OFFSET $2'
  return db.any(getAllBooks, [limit, offset])
    .then(allBooks => allBooks)
    .catch(err => Object({ success: false, message: err.message }))
}

// READ one book
const readOneBook = (id) => {
  const getThisBook = 'SELECT id, title, author_last, author_first, genre, price, image, publisher, isbn FROM books WHERE id = $1'
  return db.one(getThisBook, [id])
    .then(book => book)
    .catch(err => Object({ success: false, message: err.message }))
}

// READ search all books by author, title, or genre
const searchBooks = (searchTerms) => {
  let termz = searchTerms.split(' ')
  termz = termz.map(term => '%'+term.toLowerCase()+'%')
  let query = 'SELECT * FROM books WHERE'
  for (let i = 1; i <= termz.length; i++){
    if (i > 1) {
      query += ' OR'
    }
    query = `${query} lower(title) LIKE ($${i}) OR lower(author_first) LIKE ($${i}) OR lower(author_last) LIKE ($${i}) OR lower(genre) LIKE ($${i})`
  }
  query += ' ORDER BY title ASC'
  return db.any(query, termz)
    .then(foundBooks => foundBooks)
    .catch(err => Object({ success: false, message: err.message }))
}

// UPDATE one book
const updateBook = (title, authorLast, authorFirst, genre, price, image, publisher, isbn, id) => {
  const updateThisBook = 'UPDATE books SET title=$1, author_last=$2, author_first=$3, genre=$4, price=$5, image=$6, publisher=$7, isbn=$8 WHERE id=$9 RETURNING *'
  return db.one(updateThisBook, [title, authorLast, authorFirst, genre, price, image, publisher, isbn, id])
    .then(updatedBook => updatedBook)
    .catch(err => Object({ success: false, message: err.message }))
}

// DELETE one book
const deleteBook = (id) => {
  const deleteThisBook = 'DELETE FROM books WHERE id=$1'
  return db.result(deleteThisBook, id)
    .then(deletedBook => deletedBook)
    .catch(err => Object({ success: false, message: err.message }))
}

// register
const register = (firstName, lastName, email, hash) => {
  const addUser = 'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING first_name'
  return db.one(addUser, [firstName, lastName, email, hash])
    .then((member) => {
      console.log('register', member)
      return member
    })
    .catch(err => Object({ success: false, message: err.message }))
}

// login
const login = (email) => {
  const findUser = 'SELECT first_name, password FROM users WHERE email = $1'
  return db.oneOrNone(findUser, email)
    .then((member) => {
      console.log('login', member)
      return member
    })
    .catch(err => Object({ success: false, message: err.message }))
}

module.exports = {
  createBook,
  readOneBook,
  readAllBooks,
  updateBook,
  deleteBook,
  searchBooks,
  db,
  login,
  register
}
