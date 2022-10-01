const crypto = require('crypto')
const smskey = process.env.SMS_KEY
const serviceSid=process.env.TWILIO_SERVICE_SID
const accountSid=process.env.TWILIO_ACOUNT_SID
const authToken =process.env.TWILIO_AUTH_TOKEN

const client = require('twilio')(accountSid, authToken)



exports.sendOtp=async(phone)=>{
    console.log(phone);
    const otp = Math.floor(10000 + Math.random()*900000);
    const ttl = 2*60*1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${expires}`;
    return new Promise(async(resolve,reject)=>{
        client.verify.services(serviceSid).verifications.create({
            to : `+91${phone}`,
            channel:"sms"
        }).then((res)=>{
            resolve({result:res,hash:data})
        })
    })

}

exports.otpVerify=async(otp,phone)=>{
    let data = await client.verify.services(serviceSid).verificationChecks.create({
        to:`+91${phone}`,
        code: otp
    })
    console.log(data);
    if (!data.valid) {
        return false
    }
    return true
}