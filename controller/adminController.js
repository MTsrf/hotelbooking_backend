const { validateEmail, validateLength } = require("../helper/validate");
const admin = require('../models/admin')
const bcrypt = require('bcrypt');
const { generateToken } = require("../helper/token");
const categories = require("../models/categories");
const Vendor = require("../models/Vendor");


exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "invalid email address"
            })
        }
        const check = await admin.findOne({ email })
        if (!check) {
            return res.status(400).json({message:"Entered incorrect Email"})
        }
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
            return res.status(200).json({
                success :true,
                token:token
            })
        // res.send({
        //     id: vendor._id,
        //     name: vendor.full_name,
        //     token: token,
        //     verified: vendor.isVerified,
        //     created:true,
        //     message: "Register Success ! please activate your email to start",
        //   });
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



exports.addCategory = async (req,res)=>{
    try {
        console.log(req.body);
        const {category,description} = req.body
        const check = await categories.findOne({category:category})
        if (check) {
            return res.status(400).json({
                message:"The category already exist.."
            })
        }
        const createdCategory = await new categories({
            category:category,
            description:description,
        }).save()
        res.status(200).json({success:true,category:createdCategory,message:"Category Successfully added"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


exports.deleteCategory = async(req,res)=>{
    try {
        let deleteData = await categories.deleteOne({category:req.body.category})
        res.status(200).json({success:true,message:"Deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


exports.getCategory = async(req,res)=>{
    try {
        let getData = await categories.find()
        res.status(200).json({getData,success:true})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.updateCategory = async(req,res)=>{
    try {
        let check = await categories.findOne({category:req.body.category})
        if (check) {
            return res.status(400).json({message:"Category name already exist..."})
        }
        let updateData = await categories.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json({updateData,success:true,message:"Category updated Successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}



exports.getAllVendor = async(req,res)=>{
    try {
        let getvendor = await Vendor.find()
        res.json(getvendor)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


exports.approveVendor = async(req,res)=>{
    try { 
        const { _id } = req.body
        console.log(_id);
        const approve = await Vendor.findByIdAndUpdate(_id,{
            $set:{
                adminVerified:true
            }
        },{new:true})
        res.status(200).json({
            approve,
            success:true,
            message:"Vendor Approved Successfully.."
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}



exports.blockedVendor = async(req,res)=>{
    try {
        const { _id } = req.body 
        const blocked = await Vendor.findByIdAndUpdate(_id,{
            $set:{
                isBlocked:true
            }
        },{new:true})
        res.status(200).json({
            blocked,
            success:true,
            message:"Vendor Blocked Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

exports.unBlockVendor = async(req,res)=>{
    try {
        const { _id } = req.body
        const unblock = await Vendor.findByIdAndUpdate(_id,{
            $set:{
                isBlocked:false
            }
        },{new:true})
        res.status(200).json({
            unblock,
            success:true,
            message:"Vendor unblocked Successfully.."
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}