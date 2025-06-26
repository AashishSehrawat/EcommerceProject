import { Product } from "../models/productModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFileOnCloudinary,
} from "../utils/cloudinary.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import fs from "fs";
import { productQuery } from "../types/types.js";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

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
  if (!user) {
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

  invalidateCache({product: true, admin: true, productId: String(product._id)});

  const populateProduct = await Product.findById(product._id).populate(
    "createdBy",
    "name"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Product created successfully", populateProduct)
    );
});

// revaildate on new, update, delete of product and also on setting order
const getLatestProduct = asyncHandler(async (req, res) => {
  let product = [];
  // check if the latest product is in cache 
  if (nodeCache.has("latestProduct")) {
    product = JSON.parse(nodeCache.get("latestProduct") as string);
  } else {
    product = await Product.find().sort({ createdAt: -1 }).limit(5);
    nodeCache.set("latestProduct", JSON.stringify(product));
  }

  if (product.length <= 0) {
    throw new ApiError(404, "Latest Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Latest Product feched successfully", product));
});

// revaildate on new, update, delete of product and also on setting order
const getAllCatogries = asyncHandler(async (req, res) => {
  let categories;

  if (nodeCache.has("categories")) {
    categories = JSON.parse(nodeCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    nodeCache.set("categories", JSON.stringify(categories));
  }

  if (!categories) {
    throw new ApiError(404, "No categories found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "all categories feched successfilly", categories)
    );
});

// revaildate on new, update, delete of product and also on setting order
const getAdminProduct = asyncHandler(async (req, res) => {
  let products;

  if (nodeCache.has("adminProducts")) {
    products = JSON.parse(nodeCache.get("adminProducts") as string);
  } else {
    products = await Product.find({});
    nodeCache.set("adminProducts", JSON.stringify(products));
  }

  if (!products) {
    throw new ApiError(404, "No Product found for admin");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All products feched for admin", products));
});

// revaildate on new, update, delete of product and also on setting order
const getSingleProduct = asyncHandler(async (req, res) => {
  const productId = req.params._id;
  if (!productId) {
    throw new ApiError(404, "Product is not found or Invalid");
  }

  let product;
  if (nodeCache.has(`product-${productId}`)) {
    product = JSON.parse(nodeCache.get(`product-${productId}`) as string);
  } else {
    product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product is not found");
    }

    nodeCache.set(`product-${productId}`, JSON.stringify(product));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Product feched successfully", product));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { title, price, stock, category } = req.body;
  const productId = req.params._id;

  // check there must be atleast one update field
  if (
    !title &&
    !price &&
    !stock &&
    !category &&
    !(req.files && "productPhoto" in req.files)
  ) {
    throw new ApiError(404, "At least one field must be updated");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product is not found");
  }

  let uploadedPhoto = null;
  if (req.files && !Array.isArray(req.files) && "productPhoto" in req.files) {
    const photoLocalpath = req.files.productPhoto[0]?.path;
    if (!photoLocalpath) {
      throw new ApiError(404, "path is invaild for upload");
    }

    uploadedPhoto = await uploadOnCloudinary(photoLocalpath);
    if (!uploadedPhoto) {
      throw new ApiError(401, "File failes to upload on cloudinary");
    }
  }

  // delete the old phot after the new one is uploaded
  if (product.productPhoto) {
    await deleteFileOnCloudinary(product.productPhoto);
  }

  if (title) product.title = title;
  if (stock) product.stock = stock;
  if (price) product.price = price;
  if (category) product.category = category;
  if (uploadedPhoto) product.productPhoto = uploadedPhoto.url;

  await product.save();

  invalidateCache({product: true, admin: true, productId: String(product._id)});

  return res
    .status(200)
    .json(new ApiResponse(200, "All Data is updated successfully", product));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params._id;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product in not found for deleting");
  }

  if (product.productPhoto) {
    await deleteFileOnCloudinary(product.productPhoto);
  }

  const deletedProduct = await Product.deleteOne({ _id: productId });
  if (!deletedProduct) {
    throw new ApiError(404, "Product is not found for deletion");
  }

  invalidateCache({product: true, admin: true, productId: String(product._id)});
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Product is deleted successfully", deletedProduct)
    );
});

const getProductBySearch = asyncHandler(async (req, res) => { 
  const { search, price, sort, category } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8; 
  const skip = limit * (page - 1);

  const query: productQuery = {};

  if (search) {
    query.title = { $regex: search as string, $options: "i" };
  }

  if (price) {
    query.price = { $lte: Number(price) };
  }

  if (category) {
    query.category = category as string;
  }

  const products = await Product.find(query)
    .sort(sort && { price: sort === "asc" ? 1 : -1 })
    .limit(limit)
    .skip(skip);

  const totalCount = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  if (products.length == 0) {
    throw new ApiError(404, "No products found by these parameters");
  }

  return res.status(200).json(
    new ApiResponse(200, "All products feched for given conditions", {
      products,
      totalPages,
    })
  );
});

export {
  newProduct,
  getLatestProduct,
  getAllCatogries,
  getAdminProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductBySearch,
};
