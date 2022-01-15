const express = require('express')
const router= express.Router()


// all authors route
router.get('/', (req,res)=>{

    res.render('authors')       // this uses index.ejs and adds on the layout automatically
})

//new author route
router.get('/new',(req,res)=>{

    res.render('authors/new')      // this uses index.ejs and adds on the layout automatically
})

//create author route
// this will not have a view, its creating data
router.post('/', (req,res)=>{   // sends data to index route

res.send('Create')

})




module.exports=router           // this exports the router; any application that links back to the file gets this export automatically(?)