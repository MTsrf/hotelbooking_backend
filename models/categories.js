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
    sub_category:[{
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"category"
        },
        name:{
            type:String,
            text:true
        },
        description:{
            type:String,
            text:true
        },
    }]

},{ timestamps:true })

module.exports = mongoose.model("category",categorySchema)
