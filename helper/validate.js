exports.validateEmail=(email)=>{
    return String(email).toLowerCase().match(/^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/)
}

exports.validateLength=(text,min,max)=>{
    if (text.length > max || text.length < min) {
        return false;
    }
    return true;
}

exports.validatePhone=(phone)=>{
    let regex =  /^\d*$/
    return regex.test(phone)
}


exports.validataOtpHash = (expires)=>{
    console.log(expires);
    console.log("expires");
    let now = Date.now();
	if (now > parseInt(expires)) {
        console.log("otp time out eroor");
        return false
	}
    return true
}