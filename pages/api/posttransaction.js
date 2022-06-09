// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDb from "../../middleware/mongoose"
import Order from "../../models/Order";
import Product from "../../models/Product";
import PaytmChecksum from "paytmchecksum";

const handler = async (req, res) => {
  // validate paytm checksum
  var paytmChecksum = "";

  var paytmParams = {}
  const received_data = req.body
  for (var key in received_data) {
    if (key == 'CHECKSUMHASH') {
      paytmChecksum = received_data[key];
    }
    else {
      paytmParams[key] = received_data[key];
    }
  }

  var isValidChecksum= PaytmChecksum.verifySignature(paytmParams,process.env.NEXT_PUBLIC_PAYTM_MKEY,paytmChecksum);
  if (!isValidChecksum) {
    res.status(500).send("Checksum error occured")
  }


  //update orders  into the orders table after checking the transaction status
  let orderid;
  if (req.body.STATUS == "TXN_SUCCESS") {
    let order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Pending", paymentInfo: JSON.stringify(req.body) ,transactionId: req.body.TXNID });
     order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Paid", paymentInfo: JSON.stringify(req.body),transactionId: req.body.TXNID });
    orderid = order._id;
    let products = order.products;
    for (let slug in products) {
      await Product.findOneAndUpdate({ slug: slug }, { $inc: { "availableQty": -products[slug].qty } })
    }
  }
  else if (req.body.STATUS == "PENDING") {
    let order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Pending", paymentInfo: JSON.stringify(req.body),transactionId: req.body.TXNID });
    orderid = order._id;
  }
  res.redirect(`/order?id=${orderid}&clearCart=1`, 200)
  //inititate shipping 

  //redirect user to the user confirmation page 


  // res.status(200).json({ body: req.body })
}
export default connectDb(handler)


// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import User from "../../models/User";


// const handler = async (req, res) => {
//    // validate paytm checksum

//    //update status into orders

//   //  let order = Order.findOne({orderId : req.body.order})
//   //  Order.findByIdAndUpdate(order._id, {status : 'Paid'})

//   res.status(200).json({ body: req.body })


// }
// export default connectDb(handler)