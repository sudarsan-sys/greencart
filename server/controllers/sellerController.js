import jwt from 'jsonwebtoken';

// Seller login - POST /api/seller/login
export const sellerLogin = (req, res) => {
    const { email, password } = req.body;

    // ✅ Check credentials against environment variables
    if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {

        // ✅ Generate JWT token with "seller" role
        const token = jwt.sign({ role: "seller" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // ✅ Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({ success: true, message: "Login successful" });
    }

    // ❌ Invalid credentials
    res.json({ success: false, message: "Invalid email or password" });
};

// Seller auth check - GET /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        // ✅ Get token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.json({ success: false, message: "Not logged in" });
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "seller") {
            return res.json({ success: false, message: "Unauthorized" });
        }

        return res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: "Authentication failed" });
    }
};

// Seller logout - GET /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        // ✅ Clear cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: "Logout failed" });
    }
};
