const cloudinary = require('cloudinary')
const fs = require('fs');
const mongoose = require('mongoose')
const Room = require('../models/Room');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.uploadImage = async (req, res) => {
    try {
        const { path,vendor,room } = req.body;
        console.log(path);
        let files = Object.values(req.files).flat();
        let images = []
        for (const file of files) {
            const url = await uploadToCloudinary(file, path);
            images.push(url)
            removeTmp(file.tempFilePath)
        }
        console.log(images);
        const uploadData = await Room.updateOne({_id:mongoose.Types.ObjectId(room),vendor:mongoose.Types.ObjectId(vendor)},{$push:{images:images}},{new:true})
        res.status(200).json({success:true,message:"Image added successfully.."})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message })
    }
}

const uploadToCloudinary = async (file, path) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(
            file.tempFilePath, {
            folder: path
        }, (err, res) => {
            if (err) {
                removeTmp(file, tempFilePath)
                return res.status(400).json({message:"Upload image failed.."})
            }
            resolve({
                url:res.secure_url
            })
        }
        )
    })
}


const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
}




