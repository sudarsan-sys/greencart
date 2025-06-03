import mongoose from "mongoose";
import { updateCart } from "../controllers/cartController.js";
import express from "express"
import authUser from "../middlewares/authUser.js";
const cartRouter = express.Router();
cartRouter.post("/update",authUser,updateCart);

export default cartRouter



