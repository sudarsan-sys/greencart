import express from "express"
import { isSellerAuth, sellerLogin, sellerLogout } from "../controllers/sellerController.js";
const sellerRouter=express.Router();
import authSeller from "../middlewares/authSeller.js"

sellerRouter.post("/login",sellerLogin);
sellerRouter.get("/is-auth",authSeller,isSellerAuth);
sellerRouter.get("/logout",sellerLogout);

export default sellerRouter;

