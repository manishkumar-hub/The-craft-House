import connectDb from "../../middleware/mongoose"
import User from '../../models/User'
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');


const handler = async (req, res) => {

    if (req.method == 'POST') {
        // console.log(req.body);
        let user = await User.findOne({ "email": req.body.email });
        if (user) {
            var bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
            var pwd = bytes.toString(CryptoJS.enc.Utf8);
            console.log
            if (req.body.email == user.email && pwd == req.body.password) {
                var token = jwt.sign({ success: true, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '5d' });
                res.status(200).json({ success: true, token, email: user.email })
            }
            else {
                res.status(400).json({ success: false, error: "Invalid credentials " })
            }
        }
        else {
            res.status(400).json({ success: false, error: "User not found" })
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
    }
}

export default connectDb(handler)