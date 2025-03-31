import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET, 
      {
        expiresIn: "1d",
      }
    );
    return accessToken;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access token");
  }
};

const newUser = asyncHandler(async (req, res) => {
  
  // Get the data from body
  const { name, email, password, gender, dob } = req.body;

  // Check if input data field are empty
  if (
    [name, email, password, gender, dob].some(
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
  
  let photoLocalPath: string = "";

  if (req.files && !Array.isArray(req.files) && 'photo' in req.files) {
    // Now we know it's the { [fieldname: string]: Multer.File[] } format
    if (req.files.photo[0] && req.files.photo.length > 0) {
        photoLocalPath = req.files.photo[0].path;
    } else {
        throw new ApiError(401, "Photo is required");
    }
  } else {
    throw new ApiError(401, "Photo is required");
  }
  console.log("photlocalpath", photoLocalPath)

  const uploadPhoto = await uploadOnCloudinary(photoLocalPath);
  console.log("uploadedphto", uploadPhoto)
  if(!uploadPhoto) {
    throw new ApiError(401, "Error in uploading file");
  }
 
  // creating the user
  const user = await User.create({
    name,
    email,
    password,
    photo: uploadPhoto.url,
    gender,
    dob: new Date(dob),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User registered successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
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

  const accessTokenCreated = await generateAccessToken(user._id); 

  const loggedInUser = await User.findById(user._id);

  // cookie
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessTokenCreated, options)
    .json(new ApiResponse(200, "User login successfully", {
      user: loggedInUser, 
      accessTokenCreated
    }));
});

const logoutUser = asyncHandler(async (req: AuthRequest, res) => {
  const user = req.user;
  
  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .clearCookie("accessToken", options)
  .json(new ApiResponse(200, "user logout successfully", user))
})

const getAllUser = asyncHandler(async (req, res) => {
  const allUsers = await User.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, "All user feched successfully", allUsers));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User feched successfully", user));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const user = await User.findByIdAndDelete(_id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully", user));
});

export { newUser, getAllUser, getUser, deleteUser, loginUser, logoutUser };
