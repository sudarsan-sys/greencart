import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// Reusable Input Component
const InputField = ({ type, name, placeholder, value, onChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary text-gray-700 transition"
  />
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    phone: '',
  });

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        address,
      };
      const { data } = await axios.post('/api/address/add', payload);

      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  useEffect(() => {
    if (!user) {
      navigate('/cart');

    }
  }, [])


  return (
    <div className="mt-16 pb-16 px-4">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col md:flex-row justify-between items-center mt-10">
        {/* LEFT: Form */}
        <div className="flex-1 max-w-md w-full">
          <form onSubmit={onSubmitHandler} className="space-y-4 mt-6 text-sm">

            {/* Row: First & Last Name */}
            <div className="flex gap-3">
              <InputField type="text" name="firstName" placeholder="First Name" value={address.firstName} onChange={handleChange} />
              <InputField type="text" name="lastName" placeholder="Last Name" value={address.lastName} onChange={handleChange} />
            </div>

            {/* Other Fields */}
            <InputField type="email" name="email" placeholder="Email" value={address.email} onChange={handleChange} />
            <InputField type="text" name="street" placeholder="Street Address" value={address.street} onChange={handleChange} />
            <InputField type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} />
            <InputField type="text" name="state" placeholder="State" value={address.state} onChange={handleChange} />
            <InputField type="text" name="country" placeholder="Country" value={address.country} onChange={handleChange} />
            <InputField type="text" name="zipcode" placeholder="Zip Code" value={address.zipcode} onChange={handleChange} />
            <InputField type="tel" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} />

            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull transition"
            >
              Save Address
            </button>
          </form>
        </div>

        {/* RIGHT: Address Image */}
        <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0">
          <img
            src={assets.add_address_iamge}
            alt="Add Address"
            className="w-full max-w-sm md:ml-16"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
