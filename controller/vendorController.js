const { validateEmail, validateLength, validatePhone } = require("../helper/validate")
const Vendor = require('../models/Vendor')
const bcrypt = require('bcrypt')
const { generateToken } = require("../helper/token")
const { sendVerificationEmail } = require("../helper/mailer")
const jwt = require('jsonwebtoken')


exports.vendor_registration = async(req,res)=>{
    try {
        console.log('hskljsldk');
        console.log(req.body);
        const {full_name,email,phone_number,password} = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({
                message:"Invalid email address"
            })
        }
        if (!validateLength(full_name,4,14)) {
            return res.status(400).json({
                message:"the name must between 4 to 14 character"
            })
        }
        if (!validatePhone(phone_number)) {
            return res.status(400).json({
                message:"your entered invalid Phone number"
            })
        }
        if (!validateLength(password,6,16)) {
            return res.status(400).json({
                message:"the password must between 8 to 16"
            })
        }
        const checkEmail = await Vendor.findOne({email:email})
        if (checkEmail) {
            return res.status(400).json({
                message:"The email is already exist"
            })
        }
        const checkPhone = await Vendor.findOne({ phone_number:phone_number })
        if (checkPhone) {
            return res.status(400).json({
                message:"the Phone Number is already exist"
            })
        }
        const passwordHash = await bcrypt.hash(password,10)
        const vendor = await new Vendor({
            isVerified:false,
            full_name:full_name,
            email:email,
            phone_number,phone_number,
            password:passwordHash
        }).save()
        const emailtoken = generateToken({vendor:vendor._id.toString()})
        const url = `${process.env.BASE_URL}/activate/${emailtoken}`;
        sendVerificationEmail(vendor.email,vendor.full_name,url)
        const token = generateToken({vendor:vendor._id.toString()})
        res.send({
            id: vendor._id,
            name: vendor.full_name,
            token: token,
            verified: vendor.isVerified,
            message: "Register Success ! please activate your email to start",
          });

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

exports.activateAccount = async(req,res)=>{
    try {
        const {token} = req.body
        const vendor = jwt.verify(token, process.env.JWT_KEY)
        const check = await Vendor.findById(vendor.vendor)
        console.log(check);
        if (check.isVerified == true) {
            return res.status(400).json({
                message:"this email is already exist"
            })
        }else{
            await Vendor.findByIdAndUpdate(vendor.vendor,{isVerified:true});
            return res.status(200).json({
                message:"Account has been activated successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


exports.vendor_login = async(req,res)=>{
    try {
        console.log(req.body);
        const {email,password} = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({
                message:"invalid email address"
            })
        }
        if (!validateLength(password,6,16)) {
            return res.status(400).json({
                message:"The password must between 6 to 16 character"
            })
        }
        const vendor = await Vendor.findOne({email:email})
        if (!vendor) {
            return res.status(400).json({
                message:"The user is not exist"
            })
        }
        const checkPassword = await bcrypt.compare(password,vendor.password)
        if (!checkPassword) {
            return res.status(400).json({
                message:"entered incorrect password"
            })
        }
        const activation = await Vendor.findOne({email:email,isVerified:true})
        if (!activation) {
            return res.status(400).json({
                message:"please activate your account"
            })
        }
        
        const token = generateToken({vendor:vendor._id.toString()})
        res.send({
            id: vendor._id,
            name: vendor.full_name,
            token: token,
            verified: vendor.isVerified,
            created:true,
            message: "Register Success ! please activate your email to start",
          });
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}