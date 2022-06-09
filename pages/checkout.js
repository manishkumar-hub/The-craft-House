import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AiFillCloseSquare } from 'react-icons/ai'
import { BsFillBagCheckFill } from 'react-icons/bs'
import { AiOutlineShoppingCart, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import Head from 'next/head';
import Script from 'next/script';
import Router from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Checkout = ({ cart, clearCart, subtotal, addtoCart, removeFromCart }) => {
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [phone, setphone] = useState('')
  const [address, setaddress] = useState('')
  const [pincode, setpincode] = useState('')
  const [city, setcity] = useState('')
  const [state, setstate] = useState('')
  const [disabled, setdisabled] = useState(true)
  const [user, setuser] = useState()
  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem('myuser'));
    if (myuser.token) {
      setuser(myuser)
      setemail(myuser.email);
      fetchData(myuser.token)
    }
  }, []);
  // console.log(user, email)

  const handleChange = async (e) => {

    if (e.target.name == 'name') {
      setname(e.target.value);
    }
    else if (e.target.name == 'email') {
      setemail(e.target.value);
    }
    else if (e.target.name == 'phone') {
      setphone(e.target.value);
    }
    else if (e.target.name == 'address') {
      setaddress(e.target.value);
    }
    else if (e.target.name == 'pincode') {
      setpincode(e.target.value);
      if (e.target.value.length == 6) {
        getPincode(e);
      }
      else {
        setcity('');
        setstate('');
      }
    }
    if (name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 3 && pincode.length > 3) {
      setdisabled(false);
    }
    else {
      setdisabled(true)
    }
  }
  const getPincode = async (e) => {
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
    let pinjson = await pins.json();
    console.log(pinjson[pincode])
    if (Object.keys(pinjson).includes(e.target.value)) {
      setcity(pinjson[e.target.value][0]);
      setstate(pinjson[e.target.value][1]);
    }
    else {
      setcity('');
      setstate('');
    }
  }
  const fetchData = async (token) => {
    let data = { token: token }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let res = await a.json();
    // console.log(res)
    setname(res.name);
    setaddress(res.address)
    setpincode(res.pincode)
    setphone(res.phone)
  }
  const initiatePayment = async () => {

    let amount = subtotal;
    let oid = Math.floor(Math.random() * Date.now())
    // //get a transaction token
    const data = { cart, subtotal, oid, email: email, name, address, pincode,city, phone };

    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let txnRes = await a.json();
    if (txnRes.success) {

      let txnToken = txnRes.txnToken;

      // console.log(txnToken);
      // Router.push('/order')
      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": oid, /* update order id */
          "token": txnToken, /* update token value */
          "tokenType": "TXN_TOKEN",
          "amount": amount /* update amount */
        },
        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          }
        }
      };


      // initialze configuration using init method 
      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
        // after successfully updating configuration, invoke JS Checkout
        console.log("init")
        window.Paytm.CheckoutJS.invoke();
      }).catch(function onError(error) {
        console.log("error => ", error);
      });
    }
    else {
      // localStorage.removeItem('cart');
      if (txnRes.cartClear) {
        clearCart();
      }
      toast.error(txnRes.error, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(txnRes.error)
    }

  }
  return (

    <div className='container mx-auto md:px-48  '>
      <ToastContainer
        position="top-left"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
      <title>Checkout - The Craft House</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /> </Head>
      <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} />
      <h1 className='font-bold text-4xl text-center my-8'>Checkout</h1>
      <h2 className='font-bold text-xl py-4'>1.Delivery Details </h2>
      <div className="mx-auto flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            {user ? <input value={user.email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly /> : <input value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}

          </div>
        </div>
      </div>
      <div className="px-2 ">
        <div className="relative mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea onChange={handleChange} value={address} name="address" id="address" cols="30" rows="2" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
        </div>
      </div>
      <div className="mx-auto flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input placeholder='Your 10-digit phone number' onChange={handleChange} value={phone} type="text" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input onChange={handleChange} value={pincode} type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>
      <div className="mx-auto flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">city</label>
            <input onChange={handleChange} type="text" value={city} id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />

          </div>
        </div>
      </div>
      <h2 className='font-bold text-xl py-4'>2. Review Cart Items </h2>
      <div className="  sideCart p-4  bg-blue-100">
        <span className="absolute top-2 right-3 cursor-pointer text-red-700"> <AiFillCloseSquare className='text-2xl' /> </span>

        <ol className='list-decimal font-semibold px-4'>

          {Object.keys(cart).length == 0 && <div className='mt-8 font-base '>No Items present in the Cart. Add some  items to checkout</div>}
          {!(cart === {}) && Object.keys(cart).map((k) => {
            return <li key={k} className='px-2'>
              <div className="item flex my-2  ">
                <div className=''> {cart[k].name} ( {cart[k].variant} )</div>
                <div className='flex items-center text-xl justify-center w-1/3 '><AiOutlinePlusCircle onClick={() => { addtoCart(k, 1, cart[k].price, cart[k].name, cart[k].variant) }} className='mx-1 cursor-pointer text-pink-500 ' /> {cart[k].qty} <AiOutlineMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].variant) }} className='mx-1 cursor-pointer text-pink-500 ' /> </div>
              </div>
            </li>
          })}

        </ol>
        <span className='font-bold mx-8'>Subtotal : ₹ {subtotal}</span>
      </div>
      <div className="pay">
        <Link href={"/checkout"} >
          <a >
            <button disabled={disabled} onClick={initiatePayment} className="disabled:bg-pink-300 flex mx-1 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg"> <BsFillBagCheckFill className='mt-1 mx-1' />  Pay  ₹ {subtotal} </button>  </a>
        </Link>
        <h3 className='text-red-500 mt-3 font-bold'>Note : Currently we are only accepting Card payments . Sorry, for the inconvenience caused</h3>
      </div>

    </div>
  )
}

export default Checkout