import connectDb from "../../middleware/mongoose"
import Order from "../../models/Order";
import Product from "../../models/Product";
import Router from  'next/router'


const https = require('https');
const PaytmChecksum = require('paytmchecksum');
import pincodes from '../../pincodes.json'
/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/

const handler = async (req, res) => {
    if (req.method == 'POST') {
        //check if pincode is servicable
        if (!Object.keys(pincodes).includes(req.body.pincode)) {
            res.status(200).json({success : false 
                , error: "Sorry , This pincode is not deliverable", cartClear: false })
            return
        }

        //check if cart is tempered 
        let sumTotal= 0;
        let cart = req.body.cart ;
        if (req.body.subtotal<=0) {
            res.status(200).json({success : false 
                , error: "Please add some items to cart and then try again!!",cartClear: false})
            return
        }
        for(let item in req.body.cart)
        {
            console.log(item)
            sumTotal+= cart[item].price *cart[item].qty ;
            let product = await Product.findOne({slug : item})
            // check if the cart items are out of stock 
            if (product.availableQty<cart[item].qty) {
                res.status(200).json({success : false 
                    , error: "Oops!! Some items in your cart went out of stock . Please try again.",cartClear: false})
                return
            }
            
            if (product.price!= cart[item].price) {
                res.status(200).json({success : false 
                    , error: "Oops!! Price and amount of some items has been changed . Please try again.",cartClear: true})
                return
            }
        }
        if (sumTotal!= req.body.subtotal) {
            res.status(200).json({success : false 
                , error: "Oops!! Price and amount of some items has been changed . Please try again.",cartClear: true})
            return
        }
        
        //chck if details are valid
        if (req.body.phone.length!=10) {
            res.status(200).json({success : false 
                , error: "Oops!! Please enter a valid phone number .",cartClear: false})
            return
        }
        
        if (req.body.pincode.length!=6) {
            res.status(200).json({success : false 
                , error: "Oops!! Please enter a valid PINCODE .",cartClear: false})
            return
        }


        //Insert entry in the orders table 
        var paytmParams = {};
        let order = new Order({
            name: req.body.name,
            email: req.body.email,
            orderId : req.body.oid ,
            address : req.body.address ,
            city : req.body.city ,
            pincode : req.body.pincode ,
            phone : req.body.phone ,
            amount : req.body.subtotal ,
            products : req.body.cart 
            });
    await order.save();

        paytmParams.body = {
            "requestType": "Payment",
            "mid": process.env.NEXT_PUBLIC_PAYTM_MID ,
            "websiteName": "YOUR_WEBSITE_NAME",
            "orderId": req.body.oid,
            "callbackUrl": `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
            "txnAmount": {
                "value": req.body.subtotal,
                "currency": "INR",
            },
            "userInfo": {
                "custId": req.body.email,
            },  
        };

        /*
        * Generate checksum by parameters we have in body
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
        */
        const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.NEXT_PUBLIC_PAYTM_MKEY)

        paytmParams.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(paytmParams);

        const requestAsync = () => {
            return new Promise((resolve, reject)=>{
                var options = {

                    /* for Staging */
                    hostname: 'securegw-stage.paytm.in',
    
                    /* for Production */
                    // hostname: 'securegw.paytm.in',
    
                    port: 443,
                    path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID }&orderId=${req.body.oid}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };
    
                var response = "";
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });
    
                    post_res.on('end', function () {
                        let ress= JSON.parse(response).body
                        ress.success= true;
                        // console.log('Response: ', response);
                        resolve(ress);
                    });
                });
    
                post_req.write(post_data);
                post_req.end();
            })
           
        }

        let myr = await requestAsync()
        res.status(200).json(myr)

    }
}
export default connectDb(handler)

// const handler = async (req, res) => {

//     if (req.method == 'POST') {
//         // console.log(req.body);
//         const { name, email } = req.body
        

//         //check is the cart is tempered --pending 

//         //check if cart items are out of stock -- pending 

//         //check if details are valid 


//         //Initiate an order corresponding to this order 
//         let order = new Order({
//             email: req.body.email,
//             orderId : req.body.oid ,
//             address : req.body.address ,
//             amount : req.body.subtotal ,
//             status : 'Paid' ,
//             products : req.body.cart 
//         });
//         await order.save();
//         // Router.push('/orders')
//         // res.redirect('/orders')
//         res.status(200).json({ success: "Saved succesfully" })
//     }
//     else {
//         res.status(400).json({ error: "This method is not allowed" })
//     }
// }


// export default connectDb(handler)
