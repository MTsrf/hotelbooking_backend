const jwt = require('jsonwebtoken');
const admin = require('../models/admin');
const Vendor = require('../models/Vendor');
const users = require('../models/user');
const user = require('../models/user');


const verifyToken = (req, res, next) => {
    console.log(req.headers.authorization);
    let token
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            console.log("===============");
            console.log(token);
            jwt.verify(token, process.env.JWT_KEY, (err, user) => {
                if (err) {
                    return res.status(400).json({
                        message:err.message
                    })
                }
                if (err) return res.status(400).json({message:err.message})
                console.log("ithe user");
                console.log(user);
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
            console.log(checkuser);
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
        console.log("vendor");
        console.log(vendor);
        const check = await Vendor.findById(vendor)
        console.log(check);
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
    console.log("sdsdhjk");
    verifyToken(req, res, async () => {
        const { user } = req.user
        console.log(user);
        const check = await admin.findById(user)
        console.log(check);
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