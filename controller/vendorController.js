const { validateEmail, validateLength, validatePhone } = require("../helper/validate")
const Vendor = require('../models/Vendor')
const Hotel = require('../models/Hotel')
const categories = require('../models/categories')
const bcrypt = require('bcrypt')
const { generateToken } = require("../helper/token")
const { sendVerificationEmail } = require("../helper/mailer")
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Room = require("../models/Room")
const booking = require("../models/booking")

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
            adminVerified:false,
            isBlocked:false,
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
        if (check.isVerified == true) {
            return res.status(400).json({
                message:"the email already activated"
            })
        }else{
            await Vendor.findByIdAndUpdate(vendor.vendor,{isVerified:true});
            return res.status(200).json({ success:true,
                message:"Account has been activated successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


exports.vendorLogin = async(req,res)=>{
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
                message:"The email address not exist"
            })
        }
        const activation = await Vendor.findOne({email:email,isVerified:true})
        if (!activation) {
            return res.status(400).json({
                message:"please activate your account"
            })
        }
        const adminVerified = await Vendor.findOne({email:email,adminVerified:true})
        if (!adminVerified) {
            return res.status(400).json({
                message:"Admin not approved your account please wait"
            })
        }
        const blocked = await Vendor.findOne({email:email,isBlocked:true})
        if(blocked){
            return res.status(400).json({
                message:"Admin Blocked your account"
            })
        }
        const checkPassword = await bcrypt.compare(password,vendor.password)
        if (!checkPassword) {
            return res.status(400).json({
                message:"entered incorrect password"
            })
        }
        
        
        const token = generateToken({vendor:vendor._id.toString()})
        res.send({
            id: vendor._id,
            name: vendor.full_name,
            token: token,
            verified: vendor.isVerified,
            created:true,
            message: "Login Successfully ! ",
          });
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


exports.getCategory = async(req,res) =>{
    try {
        let category = await categories.find()
        res.status(200).json(category)
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.getHotel=async(req,res)=>{
    try {
        let hotel = await Hotel.find({vendor:mongoose.Types.ObjectId(req.params.id)})
        res.status(200).json(hotel)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


exports.addHotel = async(req,res)=>{
    try {
        console.log(req.body);
        const { property_name, phone_number, property_details, email, categories,vendor } = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({
                message:"invalid email address"
            })
        }
       
        if (!validateLength(property_name,6,150)) {
            return res.status(400).json({
                message:"The property name minimum 6 character"
            })
        }
       
        if (!validateLength(property_details,10,1500)) {
            return res.status(400).json({
                message:"The Property details minimum 10 character"
            })
        }
        
        const check = await Hotel.findOne({property_name:property_name})
        if (check) {
            return res.status(400).json({
                message:"The property name already exist"
            })
        }
        const checkPassword = await Hotel.findOne({phone_number:phone_number})
        if (checkPassword) {
            return res.status(400).json({
                message:"The phone number already exist"
            })
        }
        const emailCheck = await Hotel.findOne({ email:email})
        if (emailCheck) {
            return res.status(400).json({
                message:"The email already exist"
            })
        }
        console.log(vendor);
        console.log("ivide");
       
        const postData = await new Hotel({
            property_name:property_name,
            phone_number:phone_number,
            property_details:property_details,
            email:email,
            category:mongoose.Types.ObjectId(categories),
            vendor:mongoose.Types.ObjectId(vendor)
        }).save()
        console.log(postData);
        res.status(200).json({
            postData,success:true,message:"property Added successfully"
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}



exports.addLocation = async(req,res)=>{
    try {
        const { address,city,street,landmark,pincode,country,state,hotel } = req.body
        console.log(req.body)
        const pushlocation = await Hotel.findOneAndUpdate({_id:hotel},{
            address:address,
            city:city,
            street:street,
            landmark:landmark,
            pincode:pincode,
            country:country,
            state:state
        },{new:true})
        console.log(pushlocation)
        res.status(200).json({ pushlocation,success:true,message:"Location added successfully"})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:error.message})
    }
}


exports.addRoom = async(req,res)=>{
    try {
        console.log(req.body);
        const { room_name, room_type, no_of_rooms, view, no_of_persons, price, no_of_beds, checkin, checkout,bathroom, category, property, vendor}= req.body
        const check = await Room.findOne({room_name:room_name,vendor:mongoose.Types.ObjectId(vendor),property:mongoose.Types.ObjectId(property),category:mongoose.Types.ObjectId(category)})
        if (check) {
            return res.status(400).json({message:"Room already registerd"})
        }
        const roomData = await new Room({
            room_name:room_name,
            room_type:room_type,
            view:view,
            guest:no_of_persons,
            price:price,
            no_of_bed:no_of_beds,
            checkin_time:checkin,
            checkout_time:checkout,
            bathroom:bathroom,
            isBlocked:false,
            roomNumbers:no_of_rooms,
            category:mongoose.Types.ObjectId(category),
            property:mongoose.Types.ObjectId(property),
            vendor:mongoose.Types.ObjectId(vendor)
        }).save()
        res.status(200).json({
            roomData,success:true,message:"Successfully added"
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

exports.addAmenities = async(req,res)=>{
    try {
        const { item,...res} = req.body
        console.log(req.body);
    } catch (error) {
        
    }
}


exports.bookedDetails = async(req,res)=>{
    try {
        const booked = await booking.aggregate([
            {
                $lookup:{
                    from:'users',
                    localField:'user',
                    foreignField:'_id',
                    as:'user'
                }
            },{$unwind:'$user'},
            {
                $lookup:{
                    from:'rooms',
                    localField:'room',
                    foreignField:'_id',
                    as:'room'
                }
            },{$unwind:'$room'},
            {
                $match:{'room.vendor':mongoose.Types.ObjectId(req.user.vendor)}
            },{
                $lookup:{
                    from:'hotels',
                    localField:'room.property',
                    foreignField:'_id',
                    as:'property'
                }
            },{$unwind:'$property'},
            {
                $lookup:{
                    from:'categories',
                    localField:'room.category',
                    foreignField:'_id',
                    as:'category'
                }
            },{$unwind:'$category'}
        ])
        res.status(200).json(booked)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.bookedDetailsUpdate = async(req,res)=>{
    const {id} = req.body
    try {
        const update = await booking.findByIdAndUpdate(id,{
            $set:req.query
        },{new:true})
        console.log(update);
        res.status(200).json({success:true})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}