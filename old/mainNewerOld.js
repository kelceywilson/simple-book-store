
console.log('Sanity Check: JS is working!')

// cheaper than db search - DOM Search function (not in spec)
// function search() {
//   var input, filter, listGroup, singleBook, singleBookArray, thisBooksClasses, bookId
//   input = document.getElementById('search')
//   filter = input.value.toUpperCase()
//   listGroup = document.getElementsByClassName('list-group')[0]
//   // console.log(listGroup);
//   singleBook = document.getElementsByClassName('single-book')
//   singleBookArray = Array.from(singleBook)
//   console.log(singleBookArray);
//   singleBookArray.forEach((span) => {
//     thisBooksClasses = Array.from(span.classList)
//     // console.log(thisBooksClasses[2]);
//     bookId = thisBooksClasses[2].toString()
//     if (span.innerHTML.toUpperCase().indexOf(filter) > -1) {
//       $(`#${bookId}`)[0].style.display = ''
//     } else {
//       $(`#${bookId}`)[0].style.display = 'none'
//     }
//   })
// }

/////////////////////////
//   Fetchers - CRUD   //
/////////////////////////

const baseUrl = 'https://mutably.herokuapp.com/books/'

// C  -  POST /books CREATES a book
function createBook(title, author, image) {
  fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({
      title,
      author,
      image
    }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(console.log)
}

// R  -  GET /books READS all books
function readBooks() {
  return fetch(baseUrl)
}

// U  -  PUT /books UPDATES one book
function updateBook(title, author, image, id) {
  fetch(baseUrl + id, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      author,
      image
    }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(console.log)
}

// D  -  DELETE /book DELETES one book
function deleteBook(id) {
  fetch(baseUrl + id, {
    method: 'DELETE'
  })
    .then(console.log)
}

/////////////////////////
//       Actions       //
/////////////////////////

function bookTheDom(bookId, bookTitle, bookAuthor, bookImage) {
  $('.list-group').prepend(`
    <div class='book-div-${bookId}' id='${bookId}'>
      <div class='single-book single-book-${bookId} ${bookId}'>
        <div class='edit-layout-${bookId} row'>
          <div class='spans'>
            <span class='title-${bookId}'>${bookTitle}</span>
            <div>by</div>
            <span class='author-${bookId}'>${bookAuthor}</span>
            <button class='edit-button but-${bookId}' onClick='editBook(this)' data-id=${bookId} data-url=${bookImage}>Edit</button>
            <button class='delete-button but-${bookId}' onClick='removeBook(this)' data-id=${bookId}>Delete</button>
          </div>
          <img class='image-${bookId}' src=${bookImage} alt='book cover' />
        </div>
      </div>
      <button class='hide save-button but-${bookId}' onClick='saveBook(this)' data-id=${bookId} data-url=${bookImage}>Save</button>
      <hr>
    </div>
  `)

}

// Populates the DOM with all books in the database
function populateAllBooks() {
  readBooks()
    .then(data => data.json())
    // .then(list => bookTheDom(list))
    .then((list) => {
      list.books.forEach((book) => {
        const bookId = book._id
        const bookTitle = book.title
        const bookAuthor = book.author
        const bookImage = book.image
        bookTheDom(bookId, bookTitle, bookAuthor, bookImage)
      })
    })
}

// Adds a new book to the DOM and the database
function addBook() {
  const title = $('.title').val()
  const author = $('.author').val()
  const image = $('.image').val()
  const id = 'newBook'
  bookTheDom(id, title, author, image)
  createBook(title, author, image)
}

// Allows a book to be edited directly on the DOM
function editBook(elem) {
  // get book id
  const id = $(elem).data('id')
  const url = $(elem).data('url')
  // show Save button and hide Edit button
  $(`.but-${id}`).toggleClass('hide')
  $(`.edit-layout-${id}`).toggleClass('row')
  // function to convert book info into input boxes
  $(`.single-book-${id}`).each(() => {
    $(`span.title-${id}`).replaceWith(function () {
      const spanText = $(this).text()
      return `<input class='edit title-${id}' type='text' value='${spanText}'>`
    })
    $(`span.author-${id}`).replaceWith(function () {
      const spanText = $(this).text()
      return `<input class='edit author-${id}' type="text" value='${spanText}'>`
    })
    $(`img.image-${id}`).replaceWith(function () {
      return `<input class='edit image-${id}' type="text" value='${url}'>`
    })
  })
}

// Converts the edited input boxes to spans and updates the database with the edits
function saveBook(elem) {
  const id = $(elem).data('id')
  let image = $(elem).data('url')
  let title
  let author
  $(`.but-${id}`).toggleClass('hide')
  $(`.edit-layout-${id}`).toggleClass('row')
  $(`.single-book-${id}`).each(() => {
    $(`input.title-${id}`).replaceWith(function() {
      title = $(this).val()
      return `<span class='title-${id}'>${title}</span>`
    })
    $(`input.author-${id}`).replaceWith(function() {
      author = $(this).val()
      return `<span class='author-${id}'>${author}</span>`
    })
    $(`input.image-${id}`).replaceWith(function() {
      image = $(this).val()
      return `<img class='image-${id}' src=${image} width='50px' height='50px' alt='book cover' />`
    })
  })
  updateBook(title, author, image, id)
}

// Remove one book from the DOM and updates the database
function removeBook(elem) {
  const id = $(elem).data('id')
  deleteBook(id)
  $(`.book-div-${id}`).remove()
}

$(document).ready(() => {
  populateAllBooks()
})
