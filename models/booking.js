const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:user,
        required:[true,'user id required']
    },
    room:{
        type:mongoose.Types.ObjectId,
        ref:room,
        required:[true,'room data required']
    },
    roomNumber:{
        type:String,
        required:[true,'Room number is required']
    },
    Date:{
        startDate:{
            type:Date
        },
        endDate:{
            type:Date
        }
    },
    PaymentType:{
        type:String
    },
    guest:{
        type:String
    },
    GuestName:{
        type:String
    }

})

module.exports = mongoose.model("Booking",bookingSchema)