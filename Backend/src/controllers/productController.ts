import { Product } from "../models/productModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import fs from "fs";

const newProduct = asyncHandler(async (req: AuthRequest, res) => {
  const { title, price, stock, category } = req.body;

  if ([title, price, stock, category].some((field) => field == "")) {
    // when the all feilds are not provided then image also upload into local system by multer how to stop it
    if (req.files && !Array.isArray(req.files) && "productPhoto" in req.files) {
      fs.unlinkSync(req.files?.productPhoto[0]?.path);
    }
    throw new ApiError(404, "All fields are required");
  }

  const user = req.user;
  if(!user) {
    throw new ApiError(401, "please login to add product");
  }

  let photoLocalpath = "";
  if (req.files && !Array.isArray(req.files) && "productPhoto" in req.files) {
    if (req.files.productPhoto[0] && req.files.productPhoto.length > 0) {
      photoLocalpath = req.files.productPhoto[0].path;
    } else {
      throw new ApiError(401, "Product photo is required");
    }
  } else {
    throw new ApiError(401, "Product photo is required");
  }

  const uploadPhoto = await uploadOnCloudinary(photoLocalpath);
  if (!uploadPhoto) {
    throw new ApiError(401, "Uploading the file is failed");
  }

  const product = await Product.create({
    title,
    price,
    stock,
    category,
    createdBy: user._id,
    productPhoto: uploadPhoto.url,
  });

  const populateProduct = await Product.findById(product._id).populate('createdBy', 'name');

  return res
    .status(200)
    .json(new ApiResponse(200, "Product created successfully", populateProduct));
});

const getLatestProduct = asyncHandler(async (req, res) => {
  const product = await Product.find().sort({ createdAt: -1 }).limit(5);
  if (product.length <= 0) {
    throw new ApiError(404, "Latest Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Latest Product feched successfully", product));
});

export { newProduct, getLatestProduct };
