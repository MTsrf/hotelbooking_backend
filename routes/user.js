const { user_register, sendSms, otpVerification, user_login } = require('../controller/userController');
const router = require('express').Router()


router.post("/send_otp",sendSms)


router.post('/otp_verify',otpVerification)


router.post("/user_signup",user_register)

router.post("/login_user",user_login)

module.exports = router;