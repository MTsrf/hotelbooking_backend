const mongoose = require('mongoose')

const hotelSchema = mongoose.Schema({
    property_name:{
        type:String,
        required:[true,"property name required"],
        text:true
    },
    phone_number:{
        type:Number,
        required:[true,"phone_number is required"]
    },
    property_details:{
        type:String,
        text:true
    },
    email:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vendor"
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    street:{
        type:String
    },
    landmark:{
        type:String
    },
    country:{
        type:String
    },
    state:{
        type:String
    },
    pincode:{
        type:Number,
    }
},{timestamps:true})

module.exports = mongoose.model("Hotel",hotelSchema)