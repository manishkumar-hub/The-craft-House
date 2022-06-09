import React from 'react'
import { useEffect , useState } from 'react'
import { useRouter } from 'next/router';
import mongoose from 'mongoose';
import Order from '../models/Order';

const OrderPage = ({ order, subtotal, clearCart }) => {
  const router = useRouter();
  const [date, setdate] = useState()
  // router.query();
  console.log(order)
  useEffect(() => {

    setdate(new Date(order.createdAt))
    if (router.query.clearCart == 1) {
      clearCart();
    }

  }, []);


  // const { id } = router.query
  // console.log(id)
  let products = order.products
  // console.log(products)
  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">The craft House</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">Order Id:{order.orderId}</h1>

              <p className="leading-relaxed mb-4">Your order has been placed succesfully!! Your payment status is {order.status}</p>
              <p className="leading-relaxed mb-4">Order Placed on : {date && date.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="flex mb-4 text-center">
                <a className="flex-grow text-center  text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">Description</a>
                <a className="flex-grow border-b-2  border-gray-300 py-2 md:ml-15 ml-10 text-lg px-1">Quantity</a>
                <a className="flex-grow border-b-2  border-gray-300 py-2 md:ml-15 ml-10 text-lg px-1">Colour</a>
                <a className="  flex-grow border-b-2 md:ml-15 border-gray-300 py-2 text-lg px-1 ">Price</a>
              </div>
              {Object.keys(products).map((key) => {
                return <div key={key} className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-500">{products[key].name}</span>
                  <span className="ml-auto text-gray-900">{products[key].qty}</span>
                  <span className="ml-auto text-gray-900">{products[key].variant}</span>
                  <span className="ml-auto text-gray-900">₹ {products[key].price}</span>
                </div>
              })}


            </div>
            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-60 h-auto object-cover object-center rounded" src={'/orderSuccess.png'} />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let order = await Order.findById(context.query.id)

  return {
    props: { order: JSON.parse(JSON.stringify(order)) }
  }

}

export default OrderPage