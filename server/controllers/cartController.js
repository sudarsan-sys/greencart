import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !cartItems) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or cartItems",
      });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    return res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error("UpdateCart Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
};
