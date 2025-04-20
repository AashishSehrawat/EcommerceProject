import { nodeCache } from "../app.js";
import { Product } from "../models/productModel.js";
import { invalidateCacheProp, orderItemsProps } from "../types/types.js"
import { ApiError } from "./ApiError.js";

const invalidateCache = async ({product, order, admin, userId, orderId, productId} : invalidateCacheProp) => {
    if(product){
        const productKeys = ["latestProduct" , "categories" , "adminProducts", `product${productId}`];

        if(typeof productId === "string") productKeys.push(`product-${productId}`);
        
        if(typeof productId === "object") productId.forEach(i => productKeys.push(`product-${i}`));

        nodeCache.del(productKeys);
    }

    if(order) {
        const orderKeys = ["adminOrders", `myOrders-${userId}`, `order-${orderId}`];

        nodeCache.del(orderKeys);
    }

    if(admin) {

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



export {invalidateCache, reduceStock, percentageCalculate}