import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId: string): Promise<string> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found for generate access token");
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
    }
    const accessToken = jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET, 
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
      }
    );
    return accessToken;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access token");
  }
};

const newUser = asyncHandler(async (req, res, next) => {
  // Get the data from body
  const { name, email, password, photo, gender, dob } = req.body;

  // Check if input data field are empty
  if (
    [name, email, password, photo, gender, dob].some(
      (field) => field?.trim === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // if user already exist
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(500, "User already exist");
  }

  //

  // creating the user
  const user = await User.create({
    name,
    email,
    password,
    photo,
    gender,
    dob,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User registered successfully", user));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPassowrdValid = await user.isPasswordCorrect(password);

  if (!isPassowrdValid) {
    throw new ApiError(404, "Password or email is wrong");
  }

  const accessTokenCreated = generateAccessToken(user._id); 

  const loggedInUser = await User.findById(user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "User login successfully", {
      user: loggedInUser, accessTokenCreated
    }));
});

const getAllUser = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, "All user feched successfully", allUsers));
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User feched successfully", user));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;

  const user = await User.findByIdAndDelete(_id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully", user));
});

export { newUser, getAllUser, getUser, deleteUser, loginUser };
