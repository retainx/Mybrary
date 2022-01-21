
const express = require('express')
const router= express.Router()
const Book = require ('../models/book')

router.get('/', async (req,res)=>{

let books

try{
    books= await Book.find().sort({createdAt: 'desc'}).limit(10).exec()                     // this grabs all the books then sorts through our database by createAt in decending order (desc) then takes the first 10 of them by most recent and then grabs the first 10 of them
}
catch{
books = []

}


    res.render('index',{ books: books })       // this uses index.ejs and adds on the layout automatically
})

module.exports=router           // this exports the router; any application that links back to the file gets this export automatically(?)