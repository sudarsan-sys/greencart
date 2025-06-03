import jwt from "jsonwebtoken"

const authSeller = async (req, res, next) => {
    const { token } = req.cookies;  // ✅ Corrected: match cookie name
    if (!token) {
        return res.json({ success: false, message: "Not authorized" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.role === "seller") {  // ✅ safer check using role, as you already do in token
            next();
        } else {
            return res.json({ success: false, message: "Not Authorized" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



export default authSeller