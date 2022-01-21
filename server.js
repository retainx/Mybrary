if (process.env.NODE_ENV !== 'production'){
    // NODE_ENV is automaticaclly set by node (?)
 require('dotenv').config()  // this line loads our developement .env variables loaded in .env

}



const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser= require('body-parser')    // neded to pull data from req.body.name form submittion

const indexRouter= require('./routes/index')
const authorRouter=require('./routes/authors')
const bookRouter=require('./routes/books')

app.set('view engine','ejs')
app.set('views', __dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))       // this refers all static files to the "public folder"
app.use(bodyParser.urlencoded({limit:'10mb', extended:false}))

const mongoose= require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true
})

const db = mongoose.connection
db.on ('error', error => console.error(error))  // if error send error message to the log files
db.once('open', ()=> console.log('connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)        //  prepend all of our routes in the authors folder with the '/authors'
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3000)