const express = require('express')
const router= express.Router()
const Author = require('../models/author') // this is the "return" value from author.js model


// all authors route
router.get('/', async (req,res)=>{
    let searchOptions={}        // empty object
    if (req.query.name != null && req.query.name != '')     // the name sent from the get request form
    {
        searchOptions.name = new RegExp(req.query.name,'i') // create regular expression that is not case sensitive
        
    }


    try{
        const authors= await Author.find(searchOptions)    // get all authors from db
        res.render('authors/index', {
            authors:authors,       // this uses index.ejs and adds on the layout automatically
            searchOptions:req.query // the search request sent from the search authors form

        })
    }
    catch{
        res.redirect('/')
    }

    
})

//new author route
router.get('/new',(req,res)=>{

    // this new Author() is the schema from the author.js model
    res.render('authors/new',{author:new Author()} )     // this uses index.ejs and adds on the layout automatically
})

//create author route
//this method is called when a form sends a POST to this (authors.js) file, this will not have a view, its creating data
// the "/" is refering to this folder level (localhost:3000/authors) not root (localhost:3000/)
router.post('/', async (req,res)=>{   
const author= new Author({
    name:req.body.name22
})

try{

const newAuthor= await author.save()        // this awaits the success of saving the author before proceeding
//res.redirect('authors/${newAuthor.id}')
res.redirect('authors')
}
//test

catch{
    res.render('authors/new',{
        author:author,
        errorMessage:'Error creating Author'
    
})
}
//res.send(req.body.name22)   //this is the name from the form submition and is posted to the authors.ejs page

})




module.exports=router           // this exports the router; any application that links back to the file gets this export automatically(?)