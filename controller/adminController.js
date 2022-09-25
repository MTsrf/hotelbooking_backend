const { validateEmail, validateLength } = require("../helper/validate");
const admin = require('../models/admin')
const bcrypt = require('bcrypt');
const { generateToken } = require("../helper/token");


exports.adminLogin = async (req, res) => {
    try {
        console.log("======");
        const { email, password } = req.body

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "invalid email address"
            })
        }
        const check = await admin.findOne({ email })
        console.log(check);
        if (check.isAdmin) {
            if (!validateLength(password, 6, 16)) {
                return res.status(400).json({
                    message: "the password must between 6 and 16 characters"
                })
            }
            
            let passwordCheck =await bcrypt.compare(password,check.password)
            
            if (!passwordCheck) {
                return res.status(400).json({
                    message:"the password is incorrect"
                })
            }
            const token = generateToken({user:check._id.toString()})
            return res.status(200).json({created :true,jwt_key:token})
        }else{
            return res.status(400).json({
                message: "user not exist ..!"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"server error" +error.message
        })
    }
}