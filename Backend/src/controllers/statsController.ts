import { nodeCache } from "../app.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getChartData, percentageCalculate } from "../utils/features.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  let stats = {};
  const key = "admin-stats";

  if (nodeCache.has(key)) {
    stats = JSON.parse(nodeCache.get(key) as string);
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
      },
    });

    const latestTransactionPromise = Order.find({})
      .select("total status discount orderItems")
      .limit(4);

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
      User.countDocuments({ gender: "male" }),
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
    );

    const count = {
      revenue,
      user: usersCount,
      order: ordersCount.length,
      product: productsCount,
    };

    const orderMonthCount = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCount[6 - monthDiff - 1] += 1;
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    const chart = {
      count: orderMonthCount,
      revenue: orderMonthlyRevenue,
    };

    const categoryCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoryCountPromise);

    let categoryNameAndCount: Record<string, number>[] = [];

    categories.forEach((category, i) => {
      categoryNameAndCount.push({
        [category]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });

    const genderRatio = {
      maleCount,
      femaleCount: usersCount - maleCount,
    };

    const modifiedLatestTransaction = latestTransaction.map((transaction) => ({
      _id: transaction._id,
      discount: transaction.discount,
      status: transaction.status,
      amount: transaction.total,
      quantity: transaction.orderItems.length,
    }));

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

    nodeCache.set(key, JSON.stringify(stats));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Stats of dashboard feched", stats));
});

const getPieChart = asyncHandler(async (req, res) => {
  let charts = {};
  const key = "admin-pie-chart";

  if (nodeCache.has(key)) {
    charts = JSON.parse(nodeCache.get(key) as string);
  } else {
    const [
      deliveredCount,
      proccessingCount,
      shippedCount,
      categories,
      productCount,
      outOfStockProductCount,
      allOrders,
      allUsers,
      adminCount,
      userCount,
    ] = await Promise.all([
      Order.countDocuments({ status: "Delivered" }),
      Order.countDocuments({ status: "Proccessing" }),
      Order.countDocuments({ status: "Shipped" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      Order.find({}).select("total discount subTotal tax shippingCharges"),
      User.find({}).select("dob"),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: proccessingCount,
      delivered: deliveredCount,
      shipped: shippedCount,
    };

    const categoryCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoryCountPromise);

    let categoryNameAndCount: Record<string, number>[] = [];

    // sending the data as number of catogries not as percent
    categories.forEach((category, i) => {
      categoryNameAndCount.push({
        [category]: categoriesCount[i],
      });
    });

    const stockAvaliability = {
      inStock: productCount - outOfStockProductCount,
      outOfStock: outOfStockProductCount,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
    const marketingCost = grossIncome * (30 / 100);
    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin: netMargin,
      discount: discount,
      productCost: productionCost,
      burnt: burnt,
      marketingCost: marketingCost,
    };

    const userAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminUserCount = {
      admin: adminCount,
      user: userCount,
    };

    charts = {
      orderFullfillment,
      categoryNameAndCount,
      stockAvaliability,
      revenueDistribution,
      userAgeGroup,
      adminUserCount,
    };

    nodeCache.set(key, JSON.stringify(charts));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Pie Chart data feched successfully", charts));
});

const getBarChart = asyncHandler(async (req, res) => {
  let charts;
  const key = "admin-bar-chart";

  if (nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
  else {
    const today = new Date();

    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    const lastSixMonthProductsPromise = Product.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastSixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastTwelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [lastSixMonthProducts, lastSixMonthUsers, lastTwelveMonthOrders] =
      await Promise.all([
        lastSixMonthProductsPromise,
        lastSixMonthUsersPromise,
        lastTwelveMonthOrdersPromise,
      ]);

    const productCounts = getChartData({
      length: 6,
      today,
      docArr: lastSixMonthProducts,
    });
    const userCounts = getChartData({
      length: 6,
      today,
      docArr: lastSixMonthUsers,
    });
    const ordersCounts = getChartData({
      length: 12,
      today,
      docArr: lastTwelveMonthOrders,
    });

    charts = {
      product: productCounts,
      user: userCounts,
      order: ordersCounts,
    };

    nodeCache.set(key, JSON.stringify(charts));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Bar Chart data feched", charts));
});

const getLineChart = asyncHandler(async (req, res) => {
  let charts;
  const key = "admin-line-chart";

  if (nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
  else {
    const today = new Date();

    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    const lastTwelveMonthProductsPromise = Product.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastTwelveMonthUsersPromise = User.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastTwelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt discount total");

    const [
      lastTwelveMonthProducts,
      lastTwelveMonthUsers,
      lastTwelveMonthOrders,
    ] = await Promise.all([
      lastTwelveMonthProductsPromise,
      lastTwelveMonthUsersPromise,
      lastTwelveMonthOrdersPromise,
    ]);

    const productsCount = getChartData({length: 12, docArr: lastTwelveMonthProducts, today});
    const usersCount = getChartData({length: 12, docArr: lastTwelveMonthUsers, today});
    const discount = getChartData({length:12, docArr: lastTwelveMonthOrders, today, property: "discount"});
    const revenue = getChartData({length: 12, docArr: lastTwelveMonthOrders, today, property: "total"});

    charts = {
      users: usersCount,
      products: productsCount,
      discount,
      revenue, 
    }

    nodeCache.set(key, JSON.stringify(charts));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "line chart is feched", charts));
});

export { getDashboardStats, getPieChart, getBarChart, getLineChart };
