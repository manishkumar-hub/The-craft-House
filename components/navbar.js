import React from 'react'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillCloseSquare } from 'react-icons/ai'
import { MdAccountCircle } from 'react-icons/md'
import { BsFillBagCheckFill } from 'react-icons/bs'
import { AiOutlineShoppingCart, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import {useRouter} from 'next/router'


const Navbar = ({ key, logout, user, cart, addtoCart, removeFromCart, clearCart, subtotal }) => {
  const [dropdown, setdropdown] = useState(false)
  const [sidebar, setsidebar] = useState(true)
  const router = useRouter();
  // const toggleDropdown = () => {
  //   setdropdown(!dropdown)
  // }
  useEffect(() => {
    Object.keys(cart).length !== 0 && setsidebar(true)
    let exempted= ['/checkout', '/order', '/orders']
    if (exempted.includes(router.pathname)) {
      setsidebar(true)
    }
  }, []);
  const togglecart = () => {
    setsidebar(!sidebar);
    // if (ref.current.classList.contains('translate-x-full')) {
    //   ref.current.classList.remove('translate-x-full')
    //   ref.current.classList.add('translate-x-0')
    // }
    // else if (!ref.current.classList.contains('translate-x-full')) {
    //   ref.current.classList.remove('translate-x-0')
    //   ref.current.classList.add('translate-x-full')
    // }
  }
  const ref = useRef()
  return (
    <>
    <span  >
    {dropdown && <div onMouseOver={() => { setdropdown(true) }} onMouseLeave={() => { setdropdown(false) }} className="absolute py-4 right-6 rounded-md  w-36 px-6 bg-white border shadow-lg top-12 z-20">
      <ul>
        <Link href={'/myAccount'} ><a><li className='py-1 hover:text-blue-700 font-bold text-sm'>My Account</li></a></Link>
        <Link href={'/orders'} ><a><li className='py-1 hover:text-blue-700 font-bold text-sm'>Orders</li></a></Link>
        <li onClick={logout} className='py-1 hover:text-blue-700 font-bold text-sm'>Log out</li>
      </ul>
    </div>}
  </span>
    <div className={`flex py-1 mb-2 flex-col md:flex-row md:justify-start shadow-xl justify-center items-center sticky top-0 z-10 bg-white ${sidebar&&'overflow-hidden'} `}>
      <Link href={"/"}>
        <a>
          <div className=" logo mr-16 flex items-center justify-start  text-gray-900">
            <Image src={'/logo.png'} alt="The craft House" width={100} height="80" />
            <span className=' text-3xl md:text-3xl font-serif text-pink-600'><b>The Craft House</b>
            </span>
          </div>
        </a>
      </Link>
      <div classNameEmbroidery="nav">
        <ul className='flex items-center space-x-4 mx-4 font-bold'>
          <Link href={"/homedecor"}><a><li className={'hover:text-blue-600'} >Home Decor</li></a></Link>
          <Link href={"/pottery"}><a><li className={'hover:text-blue-600'}>Pottery</li></a></Link>
          <Link href={"/ceramics"}><a><li className={'hover:text-blue-600'}>Ceramics</li></a></Link>
          <Link href={"/embroidery"}><a><li className={'hover:text-blue-600'}>Embriodery</li></a></Link>
        </ul>
      </div>

      <div className="cart absolute right-0 top-4 mx-5 flex cursor-pointer items-center">
      <span onMouseOver={() => { setdropdown(true) }} onMouseLeave={() => { setdropdown(false) }}>
      {user.value && <MdAccountCircle className='md:text-4xl  text-xl cursor-pointer mx-2' />}
      </span>

        {!user.value && <Link href={'/login'}><a >
          <button className='bg-pink-600 px-2 py-1 mt-2 mx-2 rounded-md text-sm font-bold text-white'>Login</button>
        </a>
        </Link>}
        <AiOutlineShoppingCart onClick={togglecart} className='md:text-4xl mt-2 text-xl cursor-pointer' />
      </div>
      
      <div ref={ref} className={`w-72 h-[100vh] overflow-y-auto sideCart absolute  top-0 p-5 bg-blue-200  px-8  transition-all ${sidebar? '-right-80': 'right-0'}  `}>
      
        <h2 className="text-2xl font-bold text-center my-4">Shopping Cart</h2>
        <span onClick={togglecart} className="absolute top-2 right-3 cursor-pointer text-red-700"> <AiFillCloseSquare className='text-2xl' /> </span>

        <ol className='list-decimal font-semibold px-4'>

          {Object.keys(cart).length == 0 && <div className='mt-8 font-base '>No Items present in the Cart. Add some  items to checkout</div>}
          {!(cart === {}) && Object.keys(cart).map((k) => {
            return <li key={k}>
              <div className="item flex my-5  ">
                <div className='w-2/3  '> {cart[k].name} ( {cart[k].variant} )</div>
                <div className='flex items-center text-xl justify-center w-1/3 '><AiOutlinePlusCircle onClick={() => { addtoCart(k, 1, cart[k].price, cart[k].name, cart[k].variant) }} className='mx-1 cursor-pointer text-pink-500 ' /> {cart[k].qty} <AiOutlineMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].variant) }} className='mx-1 cursor-pointer text-pink-500 ' /> </div>
              </div>
            </li>
          })}

        </ol>
        <span className='font-bold mx-8'>Subtotal : ₹ {subtotal}</span>
        <div className="flex">
          <Link href={"/checkout"} >
            <a >
              <button disabled={Object.keys(cart).length === 0} className="disabled:bg-pink-300 flex mx-1 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg"> <BsFillBagCheckFill className='mt-1 mx-1' />  checkout </button>  </a>
          </Link>
          <button disabled={Object.keys(cart).length === 0} onClick={clearCart} className="disabled:bg-pink-300 flex mx-1  mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg">   Clear cart </button>
        </div>
      </div>
    </div>
    
    </>
  )
}

export default Navbar