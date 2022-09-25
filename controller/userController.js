const { otpVerify, sendOtp } = require("../helper/smsconfig");
const { generateToken } = require("../helper/token");
const { validateEmail, validatePhone, validateLength, validataOtpHash } = require("../helper/validate");
const user = require("../models/user");
const bcrypt = require('bcrypt')

exports.sendSms = async (req, res) => {
    try {
        console.log("============");
        const { phone_number } = req.body

        const check = await user.findOne({ phone_number })
        if (check) {
            return res.status(400).json({
                message: "Phone already exist"
            })
        }

        let sms = await sendOtp(phone_number)
        console.log("sms");
        console.log(sms.result.valid);
        if (!sms.result.valid) {
            res.status(200).json({ created: true, hash: sms.hash });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.otpVerification = async (req, res) => {
    try {
        const { otp, hash } = req.body
        let [phone, expires] = hash.split('.');
        console.log(expires);
        if (!validataOtpHash(expires)) {
            return res.status(400).json({
                message: "OTP Timeout..try again"
            })
        }
        let otpcheck = await otpVerify(otp, phone)
        if (!otpcheck) {
            return res.status(400).json({
                message: "entered Otp is incorrect"
            })
        }
        res.status(200).json({ created: true, phone: phone })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




exports.user_register = async (req, res) => {
    try {
        console.log(req.body);
        const { name, phone, email, password } = req.body


        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "invalid email address"
            })
        }

        let checkUser = await user.findOne({ email })
        if (checkUser) {
            return res.status(400).json({
                message: "email is already exist"
            })
        }

        if (!validatePhone(phone)) {
            return res.status(400).json({
                message: "invalid phone number"
            })
        }
        if (!validateLength(name, 4, 14)) {
            return res.status(400).json({
                message: "the name must between 4 and 14 characters"
            })
        }
        if (!validateLength(password, 6, 16)) {
            return res.status(400).json({
                message: "the password must between 6 and 16 characters"
            })
        }
        let passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash);
        const userdata = await new user({
            name: name,
            email: email,
            phone_number: phone,
            password: passwordHash
        }).save()
        console.log(userdata);
        const token = generateToken({ user: userdata._id })
        res.status(200).json({ created: true, jwt_key: token })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.user_login = async (req, res) => {
    try {
        const { username, password } = req.body

        const check = await user.findOne({ $or: [{ "email": username }, { "phone_number": username }] })
        if (!check) {
            return res.status(400).json({
                message: "user not exist ..!"
            })
        }

        const passwordCheck = await bcrypt.compare(password,check.password)
        if (!passwordCheck) {
            return res.status(400).json({
                message:"the password is incorrect"
            })
        }
        const token = generateToken({user:check._id})
        return res.status(200).json({created :true,jwt_key:token})
    } catch (error) {

    }
}