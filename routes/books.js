const express = require('express')
//const multer = require('multer')    // library for using multi-type forms, not needed when uploading image as blob to database

const router= express.Router()
const Author = require('../models/author')
const Book = require('../models/book') // this is the "return" value from book.js model


const imageMimeTypes = ['image/jpeg','image/png', 'image/gif']




// all books route
router.get('/', async (req,res)=>{
    let query = Book.find()
    if (req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))   // the 'title' should be the book.title from our book model
    }

    if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)   // the 'publishDate' should be the book.title from our book model
    }                                                                   // lte is less than or equal to for mongoose (?)

    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)   // the 'title' should be the book.title from our book model
    }
    
    try{
        const books = await query.exec()
        res.render('books/index',{
       
            books: books,
            searchOptions: req.query        // this is the form request data that was sent; we use this repopulate the text boxes with the original search
        })
    
}
catch{
    res.redirect('/')
}
    


})

//new book route
router.get('/new', async (req,res)=>{
   
    renderNewPage(res,new Book())
})

//create book route

router.post('/', async (req,res)=>{    //  this tells MULTER that we are uploading a single file named 'cover' which is the cover name from the form
                                                                //  MULTER, not used anymore, is used when submitting form data with multiple types (text, images,etc)
                                                                // see MULTER docs for usage
    
   const book = new Book({
    title:req.body.title,
    author:req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    
    description:req.body.description


   })

   saveCover(book, req.body.cover)

   try{
        const newBook = await book.save()       // if book save correctly return user to /books page
        //res.redirect('books/${newBook.id}')
        res.redirect('books')
   }
   catch{
                                                 
    renderNewPage(res,book,true)        // iff error, display initial books/new page and show an error next to btn of 'Error Creating Book'

   }

})






async function renderNewPage(res,book, hasError=false){

    try{
        // pull author list from database
const authors= await Author.find({})    // if it finds this author, it sends this data to the books/new page ;if this fails, it catches and redirects to /books page, 
        // send authors list to new page to process as .ejs
    //const book = new Book()
    const params= {
        authors:authors,
        book:book
    }
    if(hasError) params.errorMessage = 'Error Creating Book'

    
    res.render('books/new', params)
    }catch{
        res.redirect('/books')
    }
}

function saveCover(book,coverEncoded){
if (coverEncoded == null) return
const cover = JSON.parse(coverEncoded)
if (cover != null && imageMimeTypes.includes(cover.type)){
book.coverImage = new Buffer.from(cover.data, 'base64')
book.coverImageType = cover.type

}

}


module.exports=router           // this exports the router; any application that links back to the file gets this export automatically(?)