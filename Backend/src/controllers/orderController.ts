import { Order } from "../models/orderModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { invalidateCache, reduceStock } from "../utils/features.js";

const registerOrder = asyncHandler(async (req, res) => {
  const {
    shippingOrderInfo,
    user,
    orderItems,
    subTotal,
    tax,
    shippingCharges,
    discount,
    total,
  } = req.body;

  const order = await Order.create({
    shippingOrderInfo,
    user,
    orderItems,
    subTotal,
    tax,
    shippingCharges,
    discount,
    total,
  })

  if(!order) {
    throw new ApiError(404, "Some issue in creating order");
  }

  await reduceStock(orderItems);

  await invalidateCache({product: true, order: true, admin: true});

  return res
    .status(200)
    .json(new ApiResponse(200, "Order is setup", order));

});

export { registerOrder };
