const mongoose = require('mongoose')


const vendorSchema = mongoose.Schema({
    isVerified:{
        type:Boolean
    },
    full_name:{
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
    }
})

module.exports = mongoose.model("vendor",vendorSchema)