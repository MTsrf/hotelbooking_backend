const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth

const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH } = process.env;
const OauthLink = "https://developers.google.com/oauthplayground"
const auth = new OAuth2(
    MAILING_ID,
    MAILING_SECRET,
    MAILING_REFRESH,
    OauthLink
);

exports.sendVerificationEmail = (email, name, url) => {
    auth.setCredentials({
        refresh_token: MAILING_REFRESH,
    });
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRET,
            refreshToken: MAILING_REFRESH,
            accessToken
        }
    });
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: "AnyServe email verifications",
        html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:20px;font-family:Roboto;font-weight:600;color:#3b5998">
        <div style="text-align:center;padding:30px;color:#fff;background-color:#3b5998"><h1>AnyServe</h1></div>
        <span>Action requise: Activate Your AnyServe Account</span></div>
        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141023;font-size:17px;font-family:Roboto">
        <span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5 rem 0">You recently created an account on AnyServe . To complete your registration . please confirm your account</span></div><a href=${url} style="width:200px;padding:10px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Confirm your account</a>
        <div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">AnyServe, being the best hotel-booking site in the country, offers several discounts on budget hotels as well. If you are looking for the cheapest hotels with amazing deals on the website,</span></div></div>`,
    };
    stmp.sendMail(mailOptions,(err,res)=>{
        if (err) return err
        return res;
    });
}