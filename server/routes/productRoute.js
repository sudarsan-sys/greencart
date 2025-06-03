import express from "express";
import { upload } from "../configs/multer.js";
import { addProduct, changeStock, productList, productById } from "../controllers/productController.js";
// REMOVE authSeller for testing
import authSeller from "../middlewares/authSeller.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array(['images']),authSeller, addProduct); // Removed authSeller temporarily
productRouter.get("/list", productList);
productRouter.get("/id/:id", productById); // ✅ Fixed route
productRouter.post("/stock",authSeller,changeStock); // Optionally remove authSeller for now

export default productRouter;
