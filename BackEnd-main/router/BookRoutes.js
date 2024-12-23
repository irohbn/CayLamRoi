const BookController = require('../controllers/BookController')

const routes = [
{
        method: 'GET',
        url: '/books',
        handler: BookController.getAllBooks
},

{
        method: 'GET',
        url: '/',
        handler: BookController.getBooks
},

{
        method: 'GET',
        url: '/search',
        handler: BookController.searchBooks
},

{
        method: 'GET',
        url: '/search-admin',
        handler: BookController.searchBooksAdmin
},

{
        method: 'GET',
        url: '/update-book/:id',
        handler: BookController.getSingleBookById
},

{
        method: 'GET',
        url: '/book/:id',
        handler: BookController.previewBook
},

{
        method: 'POST',
        url: '/book',
        handler: BookController.addNewBook
},

{
        method: 'POST',
        url: '/book/:id',
        handler: BookController.updateBook
},

{
        method: 'GET',
        url:'/books/:id',
        handler: BookController.deleteBook
}

]
module.exports = routes;