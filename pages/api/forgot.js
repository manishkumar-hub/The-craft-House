import connectDb from "../../middleware/mongoose"
import User from '../../models/User'
import Forgot from "../../models/Forgot"
const nodemailer = require("nodemailer");
var CryptoJS = require("crypto-js");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const handler = async (req, res) => {
    // Check if user exists in database 

    //send an email to user
    if (req.body.sendMail) {
        console.log(req.body)
        let token = `ujhedqjhdquwj`
        // let forgot = new forgot({
        //     email: req.body.email,
        //     token: token,
        // });
        const oauth2Client = new OAuth2(
            `${process.env.OAUTH_CLIENTID}`, // ClientID
            `${process.env.OAUTH_CLIENT_SECRET}`, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );
        oauth2Client.setCredentials({
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
        });
        const accessToken = oauth2Client.getAccessToken()
        let email = `Hey,
    You recently requested to reset the password for your account on The Craft House --  .
    <br>
    To reset your password , Please follow the link below : <a  href ="http://localhost:30000.
    /forgot?token=${token}"> Click Here </a>
    <br>
    <br>
    If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.
    Thanks, The Craft House team` ;

        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        // let transporter = nodemailer.createTransport({
        //     // host: "smtp.ethereal.email",
        //     service : 'gmail',
        //     // port: 587,
        //     // secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: "manishkumarpandit12@gmail.com", // generated ethereal user
        //         pass: 'Manish@122', // generated ethereal password
        //     },
        // });
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        let info = await transporter.sendMail({
            from: 'manishkumarpandit12@gmail.com', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Reset Password ", // Subject line
            text: "", // plain text body
            html: email, // html body
        });

        console.log("Message sent: %s", info);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.status(200).json({ success: true })
    }
    else {
        //Reset user password
        // let dbuser = await User.findOne({ "email": req.body.email });
        if (req.body.password == req.body.cpassword) {
            let dbuser = await User.findOneAndUpdate({ email: req.body.email }, { password: CryptoJS.AES.encrypt(req.body.npassword, process.env.AES_SECRET).toString() })
            res.status(200).json({ success: true })
            console.log(dbuser)
        }
        else {
            res.status(400).json({ success: false, error: "Invalid credentials " })
        }
    }

}

export default connectDb(handler)