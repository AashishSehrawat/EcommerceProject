import { NextFunction, Request, RequestHandler, Response } from "express";
import { User, IUser } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: IUser;
}

// check if user is logged in or not
const verifyJWT = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(
        401,
        "Unauthorized access: No token provided or Please login"
      );
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new ApiError(500, "ACCESS_TOKEN_SECRET is not configured");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload;

    const userId: string = decodedToken._id.toString();
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid token: User not found");
    }

    req.user = user;
    next();
  }
) as RequestHandler;

// check if role is admin or not
const adminOnly = asyncHandler(async (req: AuthRequest, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Please login for access admin route");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(
      401,
      "Cann't access with User role only admin can access"
    );
  }

  next();
});

export { verifyJWT, AuthRequest, adminOnly };
