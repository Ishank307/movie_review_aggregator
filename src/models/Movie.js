const mongoose = require('mongoose')

// Movie schema representing basic movie metadata

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        Required: true,
        trim: true
    },
    description:{
        type:"String",
        trim:true,
    },
    genre:{
        type:"String",
        trim:true
    },
    releaseYear:{
        type:Number
    },
},
{
  timestamps:true  
}
)

module.exports=mongoose.model("Movie",movieSchema);