import React from 'react'
import { useEffect, useState } from 'react'
import Router from 'next/router';
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const MyAccount = ({ }) => {
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [phone, setphone] = useState('')
  const [address, setaddress] = useState('')
  const [pincode, setpincode] = useState('')
  const [password, setpassword] = useState('')
  const [npassword, setnpassword] = useState('')
  const [cpassword, setcpassword] = useState('')
  const [disabled, setdisabled] = useState(true)
  const [user, setuser] = useState()




  const handleChange = async (e) => {

    if (e.target.name == 'name') {
      setname(e.target.value);
    }
    else if (e.target.name == 'phone') {
      setphone(e.target.value);
    }
    else if (e.target.name == 'address') {
      setaddress(e.target.value);
    }
    else if (e.target.name == 'pincode') {
      setpincode(e.target.value);
    }
    else if (e.target.name == 'password') {
      setpassword(e.target.value);
    }
    else if (e.target.name == 'npassword') {
      setnpassword(e.target.value);
    }
    else if (e.target.name == 'cpassword') {
      setcpassword(e.target.value);
    }

  }
  const handleUserSubmit = async () => {
    let data = { token: user.token, name, address, phone, pincode }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let res = await a.json();
    if (res.success) {
      toast.success("Your details has been succcesfully updated!!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else {
      toast.error("Oops!! Some error occured!!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  const handlePasswordSubmit = async () => {
    let data = { token: user.token, email, password,npassword, cpassword }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatePassword`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let res = await a.json();
    if (res.success) {
      toast.success("Your Password has been succcesfully updated!!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setpassword('')
      setnpassword('')
      setcpassword('')
    }
    else {
      toast.error("Oops!! Some error occured!!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem('myuser'));
    if (!localStorage.getItem('myuser')) {
      Router.push('/')
    }
    if (myuser.token) {
      setuser(myuser)
      setemail(myuser.email);
      fetchData(myuser.token);
    }
  }, []);
  return (
    
    <div className='container my-9 md:ml-6 px-6 pr-10 '>
    <head><title>My Account- The House Craft</title></head>
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
      <h1 className='text-3xl text-center font-bold'>Update Your Account </h1>
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
      <Link href={""} >
        <a >
          <button onClick={handleUserSubmit} className="disabled:bg-pink-300 flex mx-auto mt-4 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg">Submit </button>  </a>
      </Link>

      <h2 className='font-bold text-xl py-4'>Change Password </h2>
      <div className="mx-auto flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
            <input onChange={handleChange} value={password} type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="npassword" className="leading-7 text-sm text-gray-600">New Password</label>
            <input onChange={handleChange} value={npassword} type="password" id="npassword" name="npassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="cpassword" className="leading-7 text-sm text-gray-600">Confirm New Password</label>
            <input onChange={handleChange} value={cpassword} type="password" id="cpassword" name="cpassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <a >
        <button onClick={handlePasswordSubmit} className="disabled:bg-pink-300 flex mx-auto mt-4 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg">Submit </button>
      </a>
    </div>
  )
}

export default MyAccount