const { user_register, sendSms, otpVerification, user_login, allRooms, getCategory, placeHotel, searchData, getHotel, bookingHotel, RazorpayPayment } = require('../controller/userController');
const router = require('express').Router()


router.post("/sendOtp",sendSms)

router.post('/otpVerify',otpVerification)

router.post("/userSignup",user_register)

router.post("/loginUser",user_login)

router.get("/getRoom",allRooms)

router.get('/getCategory',getCategory)

router.get('/getAllPlace',placeHotel)

router.post('/serachHotel',searchData)

router.get('/hotel/:id',getHotel)

router.post('/booking',bookingHotel)

router.post('/payment',RazorpayPayment)


module.exports = router;