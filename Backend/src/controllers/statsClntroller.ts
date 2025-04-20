import { nodeCache } from "../app.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { percentageCalculate } from "../utils/features.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  let stats = {};

  if (nodeCache.has("admin-stats")) {
    stats = JSON.parse(nodeCache.get("admin-stats") as string);
  } else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      }
    });

    const latestTransactionPromise = Order.find({}).select("total status discount orderItems").limit(4);

    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      usersCount,
      productsCount,
      ordersCount,
      lastSixMonthOrders,
      categories,
      maleCount,
      latestTransaction,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({gender: "male"}),
      latestTransactionPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const userChangePercent = percentageCalculate(
      thisMonthUsers.length,
      lastMonthUsers.length
    );

    const productChangePercent = percentageCalculate(
      thisMonthProducts.length,
      lastMonthProducts.length
    );

    const orderChangePercent = percentageCalculate(
      thisMonthOrders.length,
      lastMonthOrders.length
    );

    const revenueChangePercent = percentageCalculate(
      thisMonthRevenue,
      lastMonthRevenue
    );

    const revenue = ordersCount.reduce(
      (total, order) => total + (order.total || 0),
      0
    )

    const count = {
      revenue,
      user: usersCount,
      order: ordersCount.length,
      product: productsCount 
    }

    const orderMonthCount = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach(order => {
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();

      if(monthDiff < 6) {
        orderMonthCount[6 - monthDiff - 1] += 1;
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
      }
    })

    const chart = {
      count : orderMonthCount,
      revenue : orderMonthlyRevenue,
    }

    const categoryCountPromise = categories.map(category => Product.countDocuments({category}));

    const categoriesCount = await Promise.all(
      categoryCountPromise
    );

    let categoryNameAndCount: Record<string, number>[] = [];

    categories.forEach((category, i) => {
      categoryNameAndCount.push({
        [category]: Math.round((categoriesCount[i]/productsCount)*100)
      })
    })    

    const genderRatio = {
      maleCount,
      femaleCount : usersCount - maleCount,
    }

    const modifiedLatestTransaction = latestTransaction.map(transaction => ({
      _id: transaction._id,
      discount: transaction.discount,
      status: transaction.status,
      amount: transaction.total,
      quantity: transaction.orderItems.length, 
    }))

    stats = {
      latestTransaction: modifiedLatestTransaction,
      genderRatio,
      categoryNameAndCount,
      userChangePercent,
      productChangePercent,
      orderChangePercent,
      revenueChangePercent,
      count,
      chart, 
    };

    nodeCache.set("admin-stats", JSON.stringify(stats)); 
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Stats of dashboard feched", stats));
});

const getPieChart = asyncHandler(async (req, res) => {});

const getBarChart = asyncHandler(async (req, res) => {});

const getLineChart = asyncHandler(async (req, res) => {});

export { getDashboardStats, getPieChart, getBarChart, getLineChart };
