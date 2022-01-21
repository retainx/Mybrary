const mongoose = require('mongoose')
const path= require('path')
const coverImageBasePath = 'uploads/bookCovers'  // this is our path to the book cover

const bookSchema = new mongoose.Schema({

    title:{

        type:String,
        required:true
    },

    description:{
        type: String
    },

    publishDate:{
        type: Date,
        required:true
    },

    pageCount:{
        type: Number,
        required: true
    },

    createdAt:{
        type: Date,
        required:true,
        default:Date.now
    },

    coverImageName:{
        type: String,
        required:true
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,       // this is referenceing the Author Schema
        required:true,
        ref:'Author'        // this references the exported 'Author' object from the author model
    },



})

bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
      return path.join('/', coverImageBasePath, this.coverImageName)
    }
  })
  
  module.exports = mongoose.model('Book', bookSchema)
  module.exports.coverImageBasePath = coverImageBasePath