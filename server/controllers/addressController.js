import Address from "../models/Address.js";
//get address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from auth middleware
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//add address :/api/address/add

export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.userId; // Get userId from auth middleware

    await Address.create({ ...address, userId });

    res.json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.log("Add Address Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

