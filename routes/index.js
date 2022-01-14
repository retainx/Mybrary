
const express = require('express')
const router= express.Router()

router.get('/', (req,res)=>{

    res.render('index')       // this uses index.ejs and adds on the layout automatically
})

module.exports=router           // this exports the router; any application that links back to the file gets this export automatically(?)