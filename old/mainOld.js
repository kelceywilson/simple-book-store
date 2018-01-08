
console.log('Sanity Check: JS is working!')

function search() {
  var input, filter, listGroup, spans, span, spansArray
  input = document.getElementById('search')
  filter = input.value.toUpperCase()
  listGroup = document.getElementsByClassName('list-group')[0]
  // console.log(listGroup);
  spans = document.getElementsByClassName('single-book')
  spansArray = Array.from(spans)
  console.log(spans);
  spansArray.forEach((span) => {
    if (span.innerHTML.toUpperCase().indexOf(filter) > -1) {
      // let span.data(id)
      // $(`book-div-$`
      span.style.display = ''
    } else {
      span.style.display = 'none';
    }
  })
  // for (i = 0; i < spans.length; i++) {
  //   span = spans.getElementsByTagName('span')
  //   console.log(span);
  //   // a = span[i].getElementsByTagName('a')[0];
  //   if (span.innerHTML.toUpperCase().indexOf(filter) > -1) {
  //     span[i].style.display = '';
  //   } else {
  //     span[i].style.display = 'none';
  //   }
  // }
}

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

function bookTheDom(list) {
  list.books.forEach((book) => {
    $('.list-group').prepend(`
      <div class='book-div-${book._id}'>
        <div class='single-book' id='${book._id}'>
          <div class='edit-layout-${book._id} row'>
            <div class='spans'>
              <span class='title-${book._id}'>${book.title}</span>
              <div>by</div>
              <span class='author-${book._id}'>${book.author}</span>
              <button class='edit-button ${book._id}' onClick='editBook(this)' data-id=${book._id} data-url=${book.image}>Edit</button>
              <button class='delete-button ${book._id}' onClick='removeBook(this)' data-id=${book._id}>Delete</button>
            </div>
            <img class='image-${book._id}' src=${book.image} alt='book cover' />
          </div>
        </div>
        <button class='hide save-button ${book._id}' onClick='saveBook(this)' data-id=${book._id} data-url=${book.image}>Save</button>
        <hr>
      </div>
    `)
  })
}

// Populates the DOM with all books in the database
function populateAllBooks() {
  readBooks()
    .then(data => data.json())
    .then(list => bookTheDom(list))
    // .then(list =>
    //   list.books.forEach((book) => {
    //     $('.list-group').prepend(`
    //       <div class='book-div-${book._id}'>
    //         <div class='single-book' id='${book._id}'>
    //           <div class='edit-layout-${book._id} row'>
    //             <div class='spans'>
    //               <span class='title-${book._id}'>${book.title}</span>
    //               <div>by</div>
    //               <span class='author-${book._id}'>${book.author}</span>
    //               <button class='edit-button ${book._id}' onClick='editBook(this)' data-id=${book._id} data-url=${book.image}>Edit</button>
    //               <button class='delete-button ${book._id}' onClick='removeBook(this)' data-id=${book._id}>Delete</button>
    //             </div>
    //             <img class='image-${book._id}' src=${book.image} alt='book cover' />
    //           </div>
    //         </div>
    //         <button class='hide save-button ${book._id}' onClick='saveBook(this)' data-id=${book._id} data-url=${book.image}>Save</button>
    //         <hr>
    //       </div>
    //     `)
    //   }))
}

// Adds a new book to the DOM and the database
function addBook() {
  const title = $('.title').val()
  const author = $('.author').val()
  const image = $('.image').val()
  const book = 'newBook'
  $('.list-group').prepend(`
    <div class='book-div-${book}'>
      <div class='single-book' id='${book}'>
        <div class='edit-layout row'>
          <div>
            <span class='title-${book}'>${title}</span>
            <span>by</span>
            <span class='author-${book}'>${author}</span>
            <button class='edit-button ${book}' onClick='editBook(this)' data-id=${book} data-url=${image}>Edit</button>
            <button class='delete-button ${book}' onClick='removeBook(this)' data-id=${book}>Delete</button>
          </div>
          <img class='image-${book}' src=${image} alt='book cover' />
        </div>
      </div>
      <button class='hide save-button ${book}' onClick='saveBook(this)' data-id=${book} data-url=${image}>Save</button>
      <hr>
    </div>
  `)
  createBook(title, author, image)
}

// Allows a book to be edited directly on the DOM
function editBook(elem) {
  // get book id
  const id = $(elem).data('id')
  const url = $(elem).data('url')
  // show Save button and hide Edit button
  $(`.${id}`).toggleClass('hide')
  $(`.edit-layout-${id}`).toggleClass('row')
  // function to convert book info into input boxes
  $(`#${id}`).each(() => {
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
  $(`.${id}`).toggleClass('hide')
  $(`.edit-layout-${id}`).toggleClass('row')
  $(`#${id}`).each(() => {
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
