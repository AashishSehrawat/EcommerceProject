import { nodeCache } from "../app.js";
import { Product } from "../models/productModel.js";
import { invalidateCacheProp, orderItemsProps } from "../types/types.js"
import { ApiError } from "./ApiError.js";

const invalidateCache = async ({product, order, admin} : invalidateCacheProp) => {
    const productKeys = ["latestProduct" , "categories" , "adminProducts"];

    const productIds = await Product.find({}).select("_id");

    productIds.forEach(i => {
        productKeys.push(`product${i._id}`);
    })

    nodeCache.del(productKeys);
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



export {invalidateCache, reduceStock}