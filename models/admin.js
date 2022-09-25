const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    isAdmin:Boolean,
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    }
},{ timestamps:true})

module.exports = mongoose.model("admin",adminSchema)