import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import Product from '../models/Product'
// import connectDb from '../middleware/mongoose'
// import mongoose from "mongoose";

// const { MongoClient, ServerApiVersion } = require('mongodb');
const Homedecor = ({ products }) => {
  // console.log(products)
  return (
    <div>
    <head><title> Home Decor- The House Craft</title></head>
      <section className="text-gray-600 body-font">
        <div className="container md:ml-32 px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
          {Object.keys(products).length===0 && <p>All potteries are out of stock  .</p> }
            {Object.keys(products).length>0&&Object.keys(products).map((item) => {
              return <Link key={products[item]._id} href={`/product/${products[item].slug}`}>
                <div className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-2">
                  <a className="flex  justify-center  rounded overflow-hidden">
                    <img alt="ecommerce" className=" mx-auto md:mx-0 h-[30vh] md:h-[36vh] block" src={products[item].img} />
                  </a>
                  <div className="mt-4 text-center md:text-left">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{products[item].category}</h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">{products[item].title}</h2>
                    <p className="mt-1">₹ {products[item].price}</p>
                    <div className="flex">
                      <span className="mr-3">Color</span>
                      {products[item].color.includes("red") && <button className="border-2 border-red-300 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("blue") && <button className="border-2 border-blue-300 ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("pink") && <button className="border-2 border-pink-300 ml-1 bg-pink-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("green") && <button className="border-2 border-green-300 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("yellow") && <button className="border-2 border-yellow-300 ml-1 bg-yellow-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                    </div>
                  </div>
                </div>
              </Link>
            })}


          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  // if (!mongoose.connections[0].readyState) {
  //     await mongoose.connect(process.env.MONGO_URI)
  // }

  // let products = await Product.find()
  // // res.status(200).json({ products })
  // return {
  //   props: {products}, // will be passed to the page component as props
  // }
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST }/api/getProducts`)
  const data = await res.json()
  // console.log(data.products)
  let products = data.products.filter(x => x.category == "home decor");
  let variant = {};
  for (let item of products) {
    if (item.title in variant) {
      if (!variant[item.title].color.includes(item.color) && item.availableQty > 0) {
        variant[item.title].color.push(item.colour)
      }
    }
    else {
      variant[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        variant[item.title].color = [item.colour]
        // console.log(variant[item.title])
        // variant[item.title].size= [item.size]

      }
    }
    products = variant;
  }
  // Pass data to the page via props
  return { props: { products } }
}

export default Homedecor

