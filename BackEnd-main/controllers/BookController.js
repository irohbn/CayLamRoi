const boom = require('boom')
const Book = require("../models/Book")
const fs = require('fs');
const { title } = require('process');
const pump = require('util').promisify(require('stream').pipeline);

// Đưa ra tất cả sách
async function getAllBooks(req, rep){
    try {
        const books = await Book.find()
        rep.render("books",{ books })
        return rep;

     } catch (err) {
         throw boom.boomify(err)
     }
}

//Xuất danh sách sách trong MongoDB ra màn hình HomePage
async function getBooks(req, rep){
    try {
        const books = await Book.find()
        return rep.render('homepage', { books })

     } catch (err) {
         throw boom.boomify(err)
     }
}

//Thanh tìm kiếm
async function searchBooks(req, rep){
    const query = req.query.query;
    let books;
  
    if (query) {
      books = await Book.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, 
          { author: { $regex: query, $options: 'i' } } 
        ]
      }).lean();
    } else {
      //Nếu không có truy vấn, đưa ra toàn bộ sách
      books = await Book.find().lean();
    }
  
    return rep.render('homepage', { books });
  }

async function searchBooksAdmin(req, rep){
    const query = req.query.query;
    let books;
  
    if (query) {
      books = await Book.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, 
          { author: { $regex: query, $options: 'i' } } 
        ]
      }).lean();
    } else {
      //Nếu không có truy vấn, đưa ra toàn bộ sách
      books = await Book.find().lean();
    }
  
    return rep.render('books', { books });
  }



//Đưa ra sách bằng tìm kiếm theo tên
async function getSingleBookById(req, rep){
    try {
        const book = await Book.findById(req.params.id)
        rep.render("update-book", { book });

        return rep;
        //return rep.code(200)
    } catch (err) {
        throw boom.boomify(err)
    }
}

async function previewBook(req, rep){
    try {
        const book = await Book.findById(req.params.id)
        rep.send(book);
        //return rep.code(200)
    } catch (err) {
        throw boom.boomify(err)
    }
}

//Thêm sách
async function addNewBook(req, rep){
    const imgPath = `public/images/` + req.body.image.filename;
    //;
    await pump(
        req.body.image.toBuffer(),
        fs.createWriteStream(imgPath)
    );
    const newBook={
        image: imgPath,
        title: req.body.title.value,
        description: req.body.description.value,
        genre: req.body.genre.value,
        author: req.body.author.value,
        price: req.body.price.value,
    };
    try {
        let book = new Book(newBook);
        await book.save();

        rep.redirect("/books")
        //return rep.code(200)
        //.send({ Message: "New Book added successfully", data: newBook})
    }
    catch (err) {
        throw boom.boomify(err)
    }
}
//Cập nhật thông tin sách
async function updateBook(req, rep){
    const bookId = req.params.id;
    const { title, genre, description, price } = req.body;
    try {
        let updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { title, genre, description, price },
            { new: true}) 

        rep.redirect("/books");
        //return rep.code(200)
    } catch (err) {
        throw boom.boomify(err)
    }
}
//Xóa sách
async function deleteBook(req, rep){
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        return rep.redirect("/books")
        //return rep.code(200)
        //.send({ Message: `${deletedBook.title} has been deleted successfully`, data: id})
    } catch (err) {
        throw boom.boomify(err)
    }
};

module.exports={
    getAllBooks,
    searchBooks,
    searchBooksAdmin,
    getBooks,
    getSingleBookById,
    previewBook,
    addNewBook,
    updateBook,
    deleteBook,
}