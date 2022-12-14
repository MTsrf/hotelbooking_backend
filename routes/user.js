const { user_register, sendSms, otpVerification, user_login, allRooms, getCategory, placeHotel, searchData, getHotel, bookingHotel, RazorpayPayment, completeBooking, getSingleSearch, completedRoomBooking, cancelBooking } = require('../controller/userController');
const { verifyUser } = require('../middleware/verifyToken');
const router = require('express').Router()


router.post("/sendOtp",sendSms)

router.post('/otpVerify',otpVerification)

router.post("/userSignup",user_register)

router.post("/loginUser",user_login)

router.get("/getRoom",allRooms)

router.get('/getCategory',getCategory)

router.get('/getAllPlace',placeHotel)

router.post('/serachHotel',searchData)

router.post('/oneSearch',getSingleSearch)

router.get('/hotel/:id',getHotel)

router.post('/booking',verifyUser,bookingHotel)

router.post('/payment',verifyUser,RazorpayPayment)

router.post('/complete',verifyUser,completeBooking)

router.get('/finishedbooking',verifyUser,completedRoomBooking)

router.patch('/cancelBooking',verifyUser,cancelBooking)

module.exports = router;