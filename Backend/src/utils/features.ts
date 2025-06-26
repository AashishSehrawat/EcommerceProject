import { nodeCache } from "../app.js";
import { Product } from "../models/productModel.js";
import { invalidateCacheProp, orderItemsProps } from "../types/types.js"
import { ApiError } from "./ApiError.js";
import { Document } from "mongoose";

const invalidateCache = ({product, order, admin, userId, orderId, productId} : invalidateCacheProp) => {   
    if(product){
        const productKeys = ["latestProduct" , "categories" , "adminProducts"];

        if(typeof productId === "string") productKeys.push(`product-${productId}`);
        
        if(typeof productId === "object") productId.forEach(i => productKeys.push(`product-${i}`));

        nodeCache.del(productKeys);
    }

    if(order) {
        const orderKeys = ["adminOrders", `myOrders-${userId}`, `order-${orderId}`];

        nodeCache.del(orderKeys);
    }

    if(admin) {
        nodeCache.del(["admin-stats", "admin-pie-chart", "admin-bar-chart", "admin-line-chart"])
    }

}


const reduceStock = async (orderItems: orderItemsProps[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productID);
        if(!product) {
            throw new ApiError(401, "Product doesn't exit for order");
        }
        product.stock -= order.quantity;
        await product.save(); 
    }
}


const percentageCalculate = (thisMonth: number, lastMonth: number) => {
    if(lastMonth === 0) return thisMonth*100;
    const percent = (thisMonth - lastMonth)/lastMonth*100;
    return Number(percent.toFixed(0));
}

interface MyDocument extends Document {
    createdAt: Date,
    discount?: number,
    total?: number,
}

type funcProps = {
    length: number,
    docArr: MyDocument[],
    today: Date,
    property?: "discount" | "total",
}

const getChartData = ({length, docArr, today, property}: funcProps) => {
    const data: number[] = new Array(length).fill(0);

    docArr.forEach(i => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if(monthDiff < length) {
            if(property) {
                data[length - monthDiff - 1] += i[property]!;
            } else {
                data[length - monthDiff - 1] += 1;
            }
            
        }
    })

    return data;
}

export {invalidateCache, reduceStock, percentageCalculate, getChartData}