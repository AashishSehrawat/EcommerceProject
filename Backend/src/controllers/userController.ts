import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";

const newUser = asyncHandler(async (req, res, next) => {
  // Get the data from body
  const { name, email, photo, gender, _id, dob } = req.body;

  // Check if input data field are empty
  if ([name, email, gender, dob, _id, photo].some((field) => field?.trim === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // if user already exist
  const existedUser = await User.findOne({ $or: [{ email }, { _id }] });
  if (existedUser) throw new ApiError(409, "User with email already exist");

  // creating the user
  const user = await User.create({
    name,
    email,
    photo,
    gender,
    _id,
    dob,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User registered successfully", user));
});

export { newUser };
