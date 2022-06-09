import User from "../../models/User"
import connectDb from "../../middleware/mongoose"
import jsonwebtoken from "jsonwebtoken";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let token = req.body.token;
        let user = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        let dbuser = await User.findOne({ "email": req.body.email });
        var bytes = CryptoJS.AES.decrypt(dbuser.password, process.env.AES_SECRET);
        var pwd = bytes.toString(CryptoJS.enc.Utf8);
        if ( pwd == req.body.password&& req.body.npassword == req.body.cpassword) {
            let dbuser = await User.findOneAndUpdate({ email: user.email }, { password: CryptoJS.AES.encrypt(req.body.npassword, process.env.AES_SECRET).toString() })
            res.status(200).json({ success: true})
        }
        else {
            res.status(400).json({ success: false, error: "Invalid credentials " })
        }
        console.log(dbuser);
        const { name, email, address, pincode } = dbuser
    }
    else {
        res.status(400).json({success: false, error: "error" })
    }
}


export default connectDb(handler)