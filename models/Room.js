const mongoose = require('mongoose')
const roomSchema = mongoose.Schema({
    property:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vendor"
    },
    amenities:{
        type:Array
    },
    room_name:{
        type:String
    },
    room_type:{
        type:String
    },
    roomNumbers: {
        type:Number
    },
    view:{
        type:String
    },
    isBlocked:{
        type:Boolean
    },
    bathroom:{
        type:String
    },
    price:{
        type:Number
    },
    guest:{
        type:Number
    },
    no_of_bed:{
        type:Number
    },
    checkin_time:{
        type:String,
    },
    checkout_time:{
        type:String,
    },
    images:{
        type:Array
    }
},{timestamps:true})

module.exports = mongoose.model("Room",roomSchema)