const express = require('express')

const router = express.Router()

const {
  createBook,
  readAllBooks,
  readOneBook,
  updateBook,
  deleteBook,
  searchBooks
} = require('../db/db.js')


router.get('/admin', (req, res) => {
  res.render('admin')
})

router.post('/search', (req, res) => {
  searchBooks(req.body.searchTerms)
    .then((searchResults) => {
      res.render('searchResults', { books: searchResults })
    })
})

// CREATE one book
// router.post('/api/books', db.createBook)
router.post('/books', (req, res) => {
  const {
    title, authorLast, authorFirst, genre, price, publisher, isbn, image
  } = req.body
  createBook(title, authorLast, authorFirst, genre, price, publisher, isbn, image)
    .then((newBook) => {
      res.render('book', { book: newBook })
    })
})

// GET (READ) all books
// router.get('/api/books', db.readAllBooks)
router.get('/books', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10
  const offset = (page - 1) * limit
  const prev = page - 1
  const next = page + 1
  readAllBooks(limit, offset)
    .then((allBooks) => {
      res.render('books', { books: allBooks, page, prev, next })
    })
})

// GET (READ) one book
// router.get('/api/books/:id', db.readOneBook)
router.get('/books/:id', (req, res) => {
  readOneBook(req.params.id)
    .then((oneBook) => {
      res.render('book', { book: oneBook })
    })
})

// UPDATE one book
// router.put('/api/books/:id', db.updateBook)
router.put('/books/:id', (req, res) => {
  const id = req.params.id
  const {
    title, authorLast, authorFirst, genre, price, image, publisher, isbn
  } = req.body
  updateBook(title, authorLast, authorFirst, genre, price, image, publisher, isbn, id)
    .then((oneBook) => {
      res.redirect('/books/'+id)
    })
})

// router.delete('/api/books:id', db.deleteBook)
router.delete('/books/:id', (req, res) => {
  deleteBook(req.params.id)
    .then((result) => {
      console.log('delete', result);
      res.redirect('/books')
    })
})

// GET registration modal - register.pug
// router.get('/postAlert', (req, res) => {
//   res.render('postAlert', {csrfToken: req.csrfToken(), member: req.session.member})
// })
// POST register new user
// router.post('/register', (req, res) => {
//   const hash = bcrypt.hashSync(req.body.password, 14)
//   const firstName = req.body.first_name
//   const lastName = req.body.last_name
//   const email = req.body.email
//   register(firstName, lastName, email, hash)
//     .then((member) => {
//       console.log('data', member)
//       // res.clearCookie('error')
//       req.session.member = member.first_name
//       res.redirect('/postAlert')
//     })
//     .catch((error) => {
//       console.log('error.code', error.code)
//       if (error.code === '23505') {
//         res.cookie('error', 'user with that email already exists')
//       }
//       res.redirect('/')
//     })
// })
// router.post('/login', function (req, res) {
//   login(req.body.email)
//     .then((member) => {
//       if (!member) {
//         res.cookie('error', 'Invalid email/password combo')
//       } else {
//         console.log('routes', member)
//         if (bcrypt.compareSync(req.body.password, member.password)) {
//           console.log('user/password match! member:', member.first_name)
//           req.session.member = member.first_name
//           res.redirect('/postAlert')
//         } else {
//           res.render('login', { error: 'Invalid email/password combo' })
//         }
//       }
//     })
//     .catch((error) => {
//       console.log('error', error)
//       // if (error.code === '23505') {
//       //   res.cookie('error', 'user with that email already exists')
//       // }
//       // res.redirect('/')
//     })
// })

// router.get('/logout', (req, res) => {
//   if (req.session) {
//     req.session.reset()
//   }
//   res.redirect('/')
// })

module.exports = router
