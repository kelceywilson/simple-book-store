console.log('Sanity Check: JS is working!')

/////////////////////////
//       Actions       //
/////////////////////////

function cancelBookEdit(){
  location.reload();
}
// Converts element to input box given name
function elementToInput(name, spanText){
  return `<input type='text' name=${name} value='${spanText}'>`
}
// Allows a book to be edited directly on the DOM
function editBook(elem){
  const url = $(elem).data('url')
  $('.buttons').toggleClass('hide')
  $('.single-book').each(function(){
    $('span.title').replaceWith(elementToInput('title', $('span.title').text()))
    $('span.author-first').replaceWith(elementToInput('authorFirst', $('span.author-first').text()))
    $('span.author-last').replaceWith(elementToInput('authorLast', $('span.author-last').text()))
    $('span.genre').replaceWith(elementToInput('genre', $('span.genre').text()))
    $('span.price').replaceWith(elementToInput('price', $('span.price').text()))
    $('span.publisher').replaceWith(elementToInput('publisher', $('span.publisher').text()))
    $('span.isbn').replaceWith(elementToInput('isbn', $('span.isbn').text()))
    $('img.image').replaceWith(elementToInput('image', url))
  })
}

function search() {
  var input, filter, listGroup, singleBook, singleBooksArray, thisBooksClasses, bookId
  input = document.getElementById('search')
  filter = input.value.toUpperCase()
  listGroup = document.getElementsByClassName('list-group')[0]
  singleBook = document.getElementsByClassName('single-book')
  singleBooksArray = Array.from(singleBook)
  singleBooksArray.forEach((span) => {
    thisBooksClasses = Array.from(span.classList)
    bookId = thisBooksClasses[0].toString()
    if (span.innerText.toUpperCase().indexOf(filter) === -1) {
      $(span).addClass('hide')
    } else {
      $(span).removeClass('hide')
    }
  })
}

// function searchDb(event){
//   if(event.charCode === 13){
//     const input = document.getElementById('search').value
//     const inputArray = input.split(' ')
//     console.log(inputArray);
//     fetch('/search', {
//       method: 'POST',
//       body: JSON.stringify({
//         searchTerms: inputArray
//       }),
//       headers: { 'Content-Type': 'application/json' }
//     })
//       .then(console.log)
//   }
// }

// C  -  POST /books CREATES a book
// function createBook(title, author, image) {
//   fetch(baseUrl, {
//     method: 'POST',
//     body: JSON.stringify({
//       title,
//       author,
//       image
//     }),
//     headers: { 'Content-Type': 'application/json' }
//   })
//     .then(console.log)
// }

// $(document).ready(() => {
//
// })
