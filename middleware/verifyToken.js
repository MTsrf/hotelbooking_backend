const jwt = require('jsonwebtoken');
const admin = require('../models/admin');
const Vendor = require('../models/Vendor');
const users = require('../models/user');
const user = require('../models/user');


const verifyToken = (req, res, next) => {
    let token
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            jwt.verify(token, process.env.JWT_KEY, (err, user) => {
                if (err) {
                    return res.status(400).json({
                        message:err.message
                    })
                }
                if (err) return res.status(400).json({message:err.message})
                req.user = user;
                next();
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }else{
        console.log("not authorixed");
        return res.status(403).json({
            message: "You are not Authorized"
        })
    }
};



const verifyUser = (req, res, next) => {
    try {
        verifyToken(req, res, async () => {
            const checkuser = await user.findById(req.user.user)
            if (checkuser.isVerified) {
                next();
            } else {
                return res.status(403).json({
                    message: "You are not Authorized"
                })
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};

const verifyVendor = (req,res, next)=>{
    verifyToken(req,res, async()=>{
        const { vendor } = req.user
        const check = await Vendor.findById(vendor)
        if (check) {
            next()
        }else{
            return res.status(403).json({
                message:"You are not Authorized"
            })
        }
    })
}


const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, async () => {
        const { user } = req.user
        const check = await admin.findById(user)
        if (check.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: "You are not Authorized"
            })
        }
    });
};

module.exports = { verifyAdmin, verifyUser,verifyVendor }