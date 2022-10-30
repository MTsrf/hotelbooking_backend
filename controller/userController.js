const { otpVerify, sendOtp } = require("../helper/smsconfig");
const { generateToken } = require("../helper/token");
const { validateEmail, validatePhone, validateLength, validataOtpHash } = require("../helper/validate");
const user = require("../models/user");
const Room = require("../models/Room")
const bcrypt = require('bcrypt');
const { RoomContext } = require("twilio/lib/rest/insights/v1/room");
const categories = require("../models/categories");
const Hotel = require('../models/Hotel');
const { default: mongoose, mongo } = require("mongoose");
const Razorpay = require('razorpay')
const shortid = require('shortid')


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

exports.sendSms = async (req, res) => {
    try {
        console.log("============");
        const { phone_number } = req.body
        console.log(phone_number);
        const check = await user.findOne({ phone_number })
        console.log(check);
        if (check) {
            return res.status(400).json({
                message: "Phone already exist"
            })
        }
        console.log(check);

        let sms = await sendOtp(phone_number)
        console.log("sms");
        console.log(sms.result.valid);
        if (!sms.result.valid) {
            res.status(200).json({ success: true, hash: sms.hash, message: "OTP sent successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.otpVerification = async (req, res) => {
    try {
        console.log(req.body);
        const { otp, hash } = req.body
        if (!otp) {
            return res.status(400).json({
                message: "please enter Otp"
            })
        }
        if (!hash) {
            return res.status(400).json({
                message: "Phone number is required"
            })
        }
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
        res.status(200).json({ success: true, phone: phone, message: "OTP verification success" })
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
            isVerified: true,
            password: passwordHash
        }).save()
        console.log(userdata);
        const token = generateToken({ user: userdata._id })
        const profile = {
            name: userdata.name,
            email: userdata.email,
            token: token
        }
        res.status(200).json({ success: true, profile: profile, message: "Successfully Registered..." })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.user_login = async (req, res) => {
    try {
        console.log(req.body);
        const { username, password } = req.body

        if (validatePhone(username)) {
            if (!validateLength(username, 10, 10)) {
                return res.status(400).json({
                    message: "Please enter 10 Number"
                })
            }
        } else {
            if (!validateEmail(username)) {
                return res.status(400).json({
                    message: "invalid email address"
                })
            }
        }

        const check = await user.findOne({ $or: [{ "email": username }, { "phone_number": username }] })
        if (!check) {
            return res.status(400).json({
                message: "The user not exist.."
            })
        }

        const passwordCheck = await bcrypt.compare(password, check.password)
        if (!passwordCheck) {
            return res.status(400).json({
                message: "the password is incorrect"
            })
        }
        const token = generateToken({ user: check._id })
        const sendObj = {
            name: check.name,
            email: check.email,
            phone: check.phone_number,
            token: token
        }
        return res.status(200).json({ success: true, profile: sendObj, message: "User Logined successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.allRooms = async (req, res) => {
    try {
        const getRoom = await Room.find().populate("property").populate("category")
        res.json(getRoom)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getCategory = async (req, res) => {
    try {
        const category = await categories.find()
        res.json(category)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


exports.placeHotel = async (req, res) => {
    try {
        const place = await Hotel.find({}, { city: 1 }).distinct('city')
        res.json(place)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.searchData = async (req, res) => {
    try {
        console.log(req.body);
        const { destination, dates: [{ startDate, endDate }], options: { adult, children, room } } = req.body
        const hotel = await Room.aggregate([{
            $lookup: {
                from: 'hotels',
                localField: 'property',
                foreignField: '_id',
                as: 'property'
            }
        }, { $unwind: '$property' },
        {
            $match: { 'property.city': destination }
        }, {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        }, { $unwind: '$category' }])
        res.json(hotel)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.getHotel = async (req, res) => {
    try {
        console.log("sdhfksdj");
        console.log(req.params.id);
        const check = await Room.aggregate([{
            $match: { _id: mongoose.Types.ObjectId(req.params.id) }
        }, {

        }])


        const room = await Room.aggregate([{
            $match: { _id: mongoose.Types.ObjectId(req.params.id) }
        },
        {
            $lookup: {
                from: 'hotels',
                localField: 'property',
                foreignField: '_id',
                as: 'property'
            }
        }, { $unwind: '$property' },
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        }, { $unwind: '$category' }

        ])
        res.send(room)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.bookingHotel = async (req, res) => {
    console.log(req.body);
}


exports.RazorpayPayment = async (req, res) => {
    const { price } = req.body
    console.log(price);
    const payment_capture = 1
    const amount = price
    const currency = 'INR'
    console.log(process.env.RAZORPAY_KEY_ID,process.env.RAZORPAY_KEY_SECRET);
    console.log(razorpay);

    const options = {
        amount:amount *100,
        currency,
        receipt:shortid.generate(),
        payment_capture
    }
    console.log(options);
    try {
        const response = await razorpay.orders.create(options)
        console.log("completed");
        console.log(response);
        res.status(200).json({
            id:response.id,
            currency:response.currency,
            amount:response.amount,
            receipt:response.receipt
        })
    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }


}
