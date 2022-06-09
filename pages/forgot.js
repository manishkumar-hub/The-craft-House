import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link'
const Forgot = () => {
    const Router = useRouter();
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [cpassword, setcpassword] = useState('')
    useEffect(() => {
        if (localStorage.getItem('token')) {
            Router.push('/')
        }
        console.log(email)
    }, []);
    const handleChange =async  (e) => {
        if (e.target.name == 'password') {
           await setpassword(e.target.value);
        }
         if (e.target.name == 'cpassword') {
            await setcpassword(e.target.value);
        }
         if (e.target.name == 'email') {
            await setemail(e.target.value);
        }

    }
    const sendResetEmail = async () => {
        console.log(email)
        let data = {
            email: email, sendMail: true, password: password, cpassword: cpassword
        }
        console.log(data)
        let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        let res = await a.json();
        if (res.success) {
            console.log("Email has been sent")
        }
        else {
            console.log("error insend mail ")
        }
    }
    const resetPassword = async () => {
        if (password == cpassword) {

            let data = await {
                email: email, sendMail: false, password: password, cpassword: cpassword
            }
            let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            let res = await a.json();
            if (res.success) {
                console.log("Password has been Changed ")
            }
            else {
                console.log("Password not changed ")
            }
        }
        else {
            console.log("erroe cp!= pa")
        }

    }
    return (
        <div>
            <div><div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <img className="mx-auto h-12 w-auto" src="/logo.png" alt="Workflow" />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Recover Password</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Or
                            <Link href={'/login'}>
                                <a className="font-medium text-pink-600 hover:text-pink-500"> Login</a>
                            </Link>
                        </p>
                    </div>
                    {Router.query.token && <div className="mt-8 space-y-6" >
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-px">

                            <div>
                                <label htmlFor="password" className="sr-only">New Password</label>
                                <input id="password" onChange={handleChange} value={password} name="password" type="password" autoComplete="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="New Password" />
                            </div>
                            <div>
                                <label htmlFor="cpassword" className="sr-only">Confirm New Password</label>
                                <input onChange={handleChange} id="cpassword" value={cpassword} name="cpassword" type="password" autoComplete="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="Confirm New Password" />
                            </div>

                        </div>

                        <div className="flex items-center justify-between">

                        </div>

                        <div>
                            <button disabled={password != cpassword} onClick={resetPassword} type="submit" className="group relative disabled:bg-pink-300 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">

                                    <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                Continue
                            </button>
                        </div>
                    </div>}
                    {!Router.query.token && <div>
                            <input type="hidden" name="remember" value="true" />
                            <div className="rounded-md shadow-sm -space-y-px">

                                <div>
                                    <label htmlFor="email-address" className="sr-only">Email address</label>
                                    <input onChange={handleChange} value={email} id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">

                            </div>

                            <div>
                                <button onClick={sendResetEmail} type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">

                                        <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Continue
                                </button>
                            </div>
                        </div>}
                </div>
            </div></div>
        </div>
    )
}

export default Forgot