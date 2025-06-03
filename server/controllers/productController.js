import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// for to add prodc/api/product/add
export const addProduct = async (req, res) => {
  try {                                                                                       
    // ✅ Parse productData from the form
    let productData = JSON.parse(req.body.productData);

    // ✅ Get uploaded image files
    const images = req.files;

    // ✅ Upload each image to Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url; // ✅ Fixed: correct Cloudinary URL field
      })  
    );
    
    await Product.create({ ...productData, image: imagesUrl });
    // ✅ Fixed: set field as `images`, not `image`

    // ✅ Fixed typos: "succecss" and "prodcut"
    res.json({ success: true, message: "Product added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get proc : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get single product : /api/product/id/:id
export const productById = async (req, res) => {
  try {
    // ✅ Changed from req.body to req.params
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// change product instock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
