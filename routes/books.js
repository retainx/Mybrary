const express = require('express')
const multer = require('multer')    // library for using multi-type forms
const path = require('path')        // libary for using paths
const fs= require ('fs')
const router= express.Router()
const Author = require('../models/author')
const Book = require('../models/book') // this is the "return" value from book.js model
const uploadPath = path.join('public', Book.coverImageBasePath)          //.join combines two different paths
const imageMimeTypes = ['image/jpeg','image/png', 'image/gif']
const upload= multer({
dest: uploadPath,                                  // this is the server folder where the book images are stored
fileFilter: (req, file, callback) => {                  // this filters our files to only allow certain acceptable type
    callback(null, imageMimeTypes.includes(file.mimetype))          // return null if error, boolean (returns true if uploaded file mimetype               
}                                                                   // matches our allowed mime types, false sends an error)
})


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

router.post('/', upload.single('cover'), async (req,res)=>{    //  this tells MULTER that we are uploading a single file named 'cover' which is the cover name from the form
                                                                //  MULTER is used when submitting form data with multiple types (text, images,etc)
                                                                // see MULTER docs for usage
    const fileName = req.file != null ? req.file.filename : null        // returns null if no image name
   const book = new Book({
    title:req.body.title,
    author:req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,           // file path for referenceing the image on the 
    description:req.body.description


   })

   try{
        const newBook = await book.save()       // if book save correctly return user to /books page
        //res.redirect('books/${newBook.id}')
        res.redirect('books')
   }
   catch{
       if(book.coverImageName != null){
           removeBookCover(book.coverImageName)     // removes book cover from the server if there are any errors 
       }                                            // before, if there was and error, the book cover would still be saved
    renderNewPage(res,book,true)        // iff error, display initial books/new page and show an error next to btn of 'Error Creating Book'

   }

})

function removeBookCover(fileName){     

fs.unlink(path.join(uploadPath,fileName), err =>{       // go into file system and unlink this path
    if (err) console.error(err)
})
}




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


module.exports=router           // this exports the router; any application that links back to the file gets this export automatically(?)