const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        text:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true
    },
    phone_number:{
        type:String,
        required:[true,"phone number is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    isVerified:Boolean
},{ timestamps:true })

module.exports = mongoose.model("user",userSchema)