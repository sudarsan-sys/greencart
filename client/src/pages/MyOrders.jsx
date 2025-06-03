import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets';
const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
    }
    catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    if (user) {

      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className='mt-16 pb-16'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myOrders.map((order, index) => (
        <div key={order._id} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col space-y-1 md:space-y-0">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency}{order.amount}</span>
          </p>

          <div className="mt-4 space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row justify-between gap-4 p-4 border rounded-lg">
                <div className="flex items-center">
                  <img src={item.product.image[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-800">{item.product.name}</h2>
                    <p className="text-sm text-gray-500">Category: {item.product.category}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>Quantity: {item.quantity || '1'}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-primary font-semibold">
                    Amount: {currency}{item.product.offerPrice * (item.quantity || 1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
