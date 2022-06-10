import Footer from '../components/footer'
import Navbar from '../components/navbar'
import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  const [cart, setcart] = useState({})
  const router = useRouter()
  const [subtotal, setsubtotal] = useState(0)
  const [user, setuser] = useState({ value: null })
  const [key, setkey] = useState(0)
  useEffect(() => {
    // console.log("Hey useefect frm _app.js")
    try {
      if (localStorage.getItem("cart")) {
        setcart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }
      else {

      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
    const myuser = JSON.parse(localStorage.getItem('myuser'));
    if (myuser) {
      setuser({ value: myuser.token, email: myuser.email });
    }
    setkey(Math.random())

  }, [router.query]);
  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));

    let subt = 0;
    let keys = Object.keys(myCart)
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
      setsubtotal(subt)
    }
  }
  const logout = () => {
    localStorage.removeItem('myuser')
    setuser({ value: null })
    setkey(Math.random());
    Router.push('/');
    toast.success('Logged out Succesfully!', {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  const addtoCart = (itemCode, qty, price, name, variant) => {
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    }
    else {
      newCart[itemCode] = { qty: 1, price, name, variant }
    }
    setcart(newCart)
    saveCart(newCart)
  }

  const removeFromCart = (itemCode, qty, price, name, variant) => {
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty;
      console.log("Item removed")
    }
    if (newCart[itemCode].qty <= 0) {
      delete newCart[itemCode]
    }
    setcart(newCart)
    saveCart(newCart)
  }
  const clearCart = () => {
    setcart({})
    saveCart({})
    setsubtotal(0)
    // console.log("cart cleared" + cart)
  }
  const buyNow = (itemCode, qty, price, name, variant) => {
    saveCart({})
    if (localStorage.getItem('myuser')) {
      let newCart = {}
      newCart[itemCode] = { qty: 1, price, name, variant }
      setcart(newCart)
      saveCart(newCart)
      router.push('/checkout')
    }
    else
    {
      toast.warning('Please Sign in to Order!', {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/login')

    }

  }
  return <>
    <ToastContainer
      position="bottom-left"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <NextNProgress
  color= "rgb(255,0,0)"
  startPosition={0.3}
  stopDelayMs={200}
  height={3}
  showOnShallow={true}
/>

    <Navbar key={key} logout={logout} user={user} cart={cart} addtoCart={addtoCart} removeFromCart={removeFromCart} clearCart={clearCart} subtotal={subtotal} />
    <Component user={user} cart={cart} buyNow={buyNow} addtoCart={addtoCart} removeFromCart={removeFromCart} clearCart={clearCart} subtotal={subtotal}  {...pageProps} />
    <Footer />
  </>
}

export default MyApp
