const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:[true,'user id required']
    },
    room:{
        type:mongoose.Types.ObjectId,
        ref:"room",
        required:[true,'room data required']
    },
    roomNumber:{
        type:Array,
        required:[true,'Room number is required']
    },
    Date:{
        startDate:{
            type:String
        },
        endDate:{
            type:String
        }
    },
    days:{
        type:String
    },
    PaymentType:{
        type:String
    },
    amount:{
        type:Number
    },
    orderId:{
        type:String
    },
    receipt:{
        type:String
    },
    guest:{
        type:String
    },
    GuestName:{
        type:String
    },
    phone_number:{
        type:Number
    },
    isBooked:{
        type:Boolean
    },
    completed:{
        type:Boolean
    },
    cancel:{
        type:Boolean
    }

})

module.exports = mongoose.model("Booking",bookingSchema)