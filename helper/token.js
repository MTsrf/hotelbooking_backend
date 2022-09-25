const jwt = require('jsonwebtoken')


const maxAge = 3 * 24 * 60 * 60;
exports.generateToken=(data)=>{
    console.log("kityy sdlkfjd");
    console.log(data);
    return jwt.sign(data,process.env.JWT_KEY,{
        expiresIn:maxAge
    })
}