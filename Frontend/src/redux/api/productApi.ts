import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";   
import { CategoryResponse, CommonResponse, CreateProductResponse, LatestProductsResponse, ProductDetailsResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/apiTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const productApi = createApi({
    reducerPath: 'productApi',  
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${API_URL}/api/v1/product`,
        credentials: 'include', // Include credentials for CORS 
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['product'],
    endpoints: (builder) => ({
        latestProducts: builder.query<LatestProductsResponse, void>({
            query: () => '/latest',
            providesTags: ['product']
        }),
        allAdminProducts: builder.query<LatestProductsResponse, void>({
            query: () => '/admin-products',
            providesTags: ['product']
        }),
        categories: builder.query<CategoryResponse, void>({
            query: () => '/categories',
            providesTags: ['product']
        }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: ({price, search, sort, category, page}) => {
                let base = `/search-product?search=${search || ''}&page=${page || 1}`;
                if (price) {
                    base += `&price=${price}`;
                }
                if (sort) {
                    base += `&sort=${sort}`;
                }
                if (category) {
                    base += `&category=${category}`;
                }
                return base;
            },
            providesTags: ['product']
        }),
        createProduct: builder.mutation<CreateProductResponse, FormData>({
            query: (productData) => ({
                url: '/new',
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['product'],
        }),
        productDetails: builder.query<ProductDetailsResponse, string>({
            query: (id) => `/${id}`,
            providesTags: ['product'],
        }),
        updateProduct: builder.mutation<ProductDetailsResponse, UpdateProductRequest>({
            query: ({id, productData}) => ({
                url: `/${id}`,
                method: 'PUT',
                body: productData,
            }),
            invalidatesTags: ['product'],
        }),
        deleteProduct: builder.mutation<CommonResponse, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['product'],
        }),
    }),
}); 

export const { 
    useLatestProductsQuery, 
    useAllAdminProductsQuery, 
    useCategoriesQuery, 
    useSearchProductsQuery,
    useCreateProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;