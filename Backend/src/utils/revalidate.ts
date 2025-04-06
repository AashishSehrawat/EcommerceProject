import { nodeCache } from "../app.js";
import { Product } from "../models/productModel.js";
import { invalidateCacheProp } from "../types/types.js"

const invalidateCache = async ({product, order, admin} : invalidateCacheProp) => {
    const productKeys = ["latestProduct" , "categories" , "adminProducts"];

    const productIds = await Product.find({}).select("_id");

    productIds.forEach(i => {
        productKeys.push(`product${i._id}`);
    })

    nodeCache.del(productKeys);
}

export {invalidateCache}