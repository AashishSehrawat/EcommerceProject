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
}

export { getAllProducts, productQuery, invalidateCacheProp }