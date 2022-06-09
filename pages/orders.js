import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Orders = () => {
  const router = useRouter()
  const [orders, setorders] = useState([])
  useEffect(() => {
    const fetchOrders = async () => {
      let a = await fetch(`/api/myorders`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: JSON.parse(localStorage.getItem('myuser')).token }),
      })
      let res = await a.json();
      setorders(res.orders)
      console.log("res: ", res)
    }
    if (!localStorage.getItem('myuser')) {
      router.push('/')
    }
    else {
      fetchOrders();
    }


  }, []);
  return (
    <div>
    <head><title>My Orders- The House Craft</title></head>
      <div className='container bg-green-300 ml-8 mr-8'>
        <h1 className='font-bold text-2xl text-center'>My Orders</h1>
        <div className="items">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full ">
                    <thead className="bg-white border-b">
                      <tr>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          #Order ID
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          Email
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          Amount
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((item) => {
                        return <tr key={item._id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item._id}</td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.email}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.amount}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <Link href={`/order?id=${item._id}`}><a>More details</a></Link>
                          </td>
                        </tr>
                      })}


                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



// const res = await fetch(`http://localhost:3000/api/getProducts`)
// const data = await res.json()
// // console.log(data.products);
// let arr = []
// arr = data.products;
// let products = data.products.filter(x => x.slug == context.query.slug);
// // let products =  arr.filter({ slug : context.query.slug});
// // console.log(products);
// let variants = data.products.filter(item => item.title === products[0].title);
// let colorSizeSlug = {}
// for (let item of variants) {
//   // console.log(item)
//   if (Object.keys(colorSizeSlug).includes(item.color)) {
//     // colorSizeSlug[item.color][item.size]= {slug : item.slug}
//   }
//   else {
//     // colorSizeSlug[item.color]={}
//     colorSizeSlug[item.colour] = { slug: item.slug }
//   }
// }
// // console.log("color ")
// // console.log(colorSizeSlug);
// // Pass data to the page via props
// return {
//   props: { product: JSON.parse(JSON.stringify(products)), variants: JSON.parse(JSON.stringify(colorSizeSlug)) }
// }

export default Orders