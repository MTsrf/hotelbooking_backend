const { user_register, sendSms, otpVerification, user_login, allRooms } = require('../controller/userController');
const router = require('express').Router()


router.post("/sendOtp",sendSms)


router.post('/otpVerify',otpVerification)


router.post("/userSignup",user_register)

router.post("/loginUser",user_login)

router.get("/getRoom",allRooms)

module.exports = router;