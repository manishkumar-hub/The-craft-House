import connectDb from "../../middleware/mongoose"
import User from "../../models/User";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {

    if (req.method == 'POST') {
        // console.log(req.body);
        const { name, email } = req.body

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();

        let u = new User({ name, email, password:  CryptoJS.AES.encrypt(req.body.password, process.env.AES_SECRET).toString() });
        await u.save();

        res.status(200).json({ success: "Saved succesfully" })
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
    }
}


export default connectDb(handler)