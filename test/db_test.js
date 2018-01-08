const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

const db = require('../db/db.js')

expect(true).to.be.true

function titleCase(title){
  const words = title.split(' ')
  const titleCasedWords = words.map(word => word[0].toUpperCase() + word.substring(1))
  return titleCasedWords.join(' ')
}
expect(titleCase('the great mouse detective')).to.be.a('string')
expect(titleCase('a')).to.equal('A')
expect(titleCase('vertigo')).to.equal('Vertigo')
expect(titleCase('the great mouse detective')).to.equal('The Great Mouse Detective')

describe('Mocha', () => {
  // test spec (unit test)
  it('should run our tests using npm', () => {
    expect(true).to.be.ok
  })
})
// TODO - have mocha use a test database
describe('db.createBook()', function() {
  // test spec (unit test)
  it('should successfully add a book to the database', function (done) {
    const newBook = db.createBook('111', '111', '111', '111', '111', '111', '111', '111')
    expect(newBook).eventually.not.be.empty
    done()
  })
})
