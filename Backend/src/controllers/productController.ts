import { Product } from "../models/productModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const newProduct = asyncHandler(async (req, res) => {
  const { title, price, stock, description, category } = req.body;

  if (
    [title, price, stock, description, category].some((field) => field == "")
  ) {
    throw new ApiError(404, "All fields are required");
  }

  const photo = req.file?.path;
  if (!photo) {
    throw new ApiError(404, "photo is not provide or path os incorrect");
  }

  const product = await Product.create({
    title,
    price,
    stock,
    description,
    category,
    photo,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Product created successfully", product));
});

export { newProduct };
