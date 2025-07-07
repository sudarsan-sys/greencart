import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.userId; // Get userId from auth middleware

    if (!cartItems) {
      return res.status(400).json({
        success: false,
        message: "Missing cartItems",
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
