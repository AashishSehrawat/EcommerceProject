import { nodeCache } from "../app.js";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
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

  if (
    [
      shippingCharges,
      user,
      orderItems,
      subTotal,
      tax,
      shippingOrderInfo,
      discount,
      total,
    ].some((field) => field.trim == "")
  ) {
    throw new ApiError(401, "All the fields are necessary");
  }

  const order = await Order.create({
    shippingOrderInfo,
    user,
    orderItems,
    subTotal,
    tax,
    shippingCharges,
    discount,
    total,
  });

  if (!order) {
    throw new ApiError(404, "Some issue in creating order");
  }

  await reduceStock(orderItems);

  invalidateCache({
    product: true,
    order: true,
    admin: true,
    userId: user,
    productId: String(order.orderItems.map(i => i.productID))
  });

  return res.status(200).json(new ApiResponse(200, "Order is setup", order));
});

const myOrders = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  const user = await User.findById(_id);
  if (!user) {
    throw new ApiError(404, "User is not found for orders requested");
  }
  const key = `myOrders-${user._id}`;

  let orders = [];

  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find({ user: _id });
    nodeCache.set(key, JSON.stringify(orders));
  }
  if (!orders) {
    throw new ApiError(404, "No orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All orders are feched successfully", orders));
});

const allAdminOrders = asyncHandler(async (req, res) => {
  const key = `adminOrders`;

  let orders = [];

  if (nodeCache.has(key)) {
    orders = JSON.parse(nodeCache.get(key) as string);
  } else {
    orders = await Order.find({}).populate("user", "name");
    nodeCache.set(key, JSON.stringify(orders));
  }

  if (!orders) {
    throw new ApiError(404, "No orders are placed to be seen by admin");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All orders are feched successfully", orders));
});

const singleOrder = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const key = `order-${_id}`;
  let order;
  if (nodeCache.has(key)) {
    order = JSON.parse(nodeCache.get(key) as string);
  } else {
    order = await Order.findById(_id);
    if (!order) {
      throw new ApiError(
        404,
        "Order doesn't found as this order id doesn't exist"
      );
    }
    nodeCache.set(key, JSON.stringify(order));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Order feched successfully", order));
});

const processOrder = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const order = await Order.findById(_id);
  if (!order) {
    throw new ApiError(404, "Order not found for proccessing");
  }

  switch (order.status) {
    case "Proccessing":
      order.status = "Shipped";
      break;

    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: String(order.user),
    orderId: String(order._id),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Status updated successfully", order));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const order = await Order.findByIdAndDelete(_id);
  if (!order) {
    throw new ApiError(404, "Order not found for deletion");
  }

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: String(order.user),
    orderId: String(order._id),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Order deleted successfully", order));
});

export {
  registerOrder,
  myOrders,
  allAdminOrders,
  singleOrder,
  processOrder,
  deleteOrder,
};
