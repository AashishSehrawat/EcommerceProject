import { Types } from "mongoose"

type getAllProducts = {
    search? : string,
    price? : string,
    sort? : string,
    category? :string,
    page? : string,
}

type productQuery = {
    title? : {
        $regex: string,
        $options: string,
    },
    price? : {
        $lte: number,
    },
    category?: string,
}

type invalidateCacheProp = {
    product? : boolean,
    order? :boolean,
    admin? :boolean,
    userId?: string,
    orderId?: string,
    productId?: string | string[],
}

type orderItemsProps = {
    title: string,
    photo: string,
    price: number,
    quantity: number,
    productID: Types.ObjectId,
}

type shippingOrderInfoProps = {
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: number,
}

export { getAllProducts, productQuery, invalidateCacheProp, orderItemsProps, shippingOrderInfoProps }