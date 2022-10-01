const mongoose = require('mongoose')


const categorySchema = mongoose.Schema({
    category:{
        type:String,
        required:[true,"name is required"],
        text:true,
    },
    description:{
        type:String,
        text:true
    },
    images:{
        type:String
    },
    sub_category:[{
        name:{
            type:String,
            text:true
        },
        description:{
            type:String,
            text:true
        },
        images:{
            type:String
        }
    }]

},{ timestamps:true })

module.exports = mongoose.model("category",categorySchema)
