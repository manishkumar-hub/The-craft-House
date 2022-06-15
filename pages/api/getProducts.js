import Product from "../../models/Product"
import connectDb from "../../middleware/mongoose"

const handler = async (req, res) => {
    let products = await Product.find()
    // let tshirts = {};
    // for (let item of products) {
    //     if (item.title in tshirts) {
    //         if (item.availableQty > 0 && !tshirts[item.title].color.includes(item.color) ) {
    //             tshirts[item.title].color.push(item.colour)
    //         }
    //     }
    //     else {
    //         tshirts[item.title] = JSON.parse(JSON.stringify(item))
    //         if (item.availableQty > 0) {
    //             tshirts[item.title].color = [item.colour]
    //             // console.log(tshirts[item.title])
    //             // tshirts[item.title].size= [item.size]

    //         }
    //     }
    // }
    res.status(200).json({ products })
}


export default connectDb(handler)