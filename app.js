const express = require('express')
const methodOverride = require('method-override')

const bodyParser = require('body-parser')
// const sessions = require('client-sessions')
// const csrf = require('csurf')

const routes = require('./routes/routes.js')
const logger = require('morgan')

const app = express()
app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

// app.use(express.static(__dirname + '/public'));

app.use('/static', express.static('public'))
app.set('view engine', 'pug')

// app.use(sessions({
//   cookieName: 'session',
//   secret: 'some_random_string',
//   duration: 30 * 60 * 1000
// }))
// app.use(csrf()) // this needs to be above app.use(routes) - why?

app.use(routes)
app.use(logger('dev'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  // If you pass an error to next() and you do not handle it in an error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace.
  next(err)
});

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  console.log(err)
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})
