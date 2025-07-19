import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateOrderApiResponse, CreateOrderRequest } from "../../types/apiTypes";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api/v1/product",
        credentials: "include", // Include credentials for CORS
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        newOrder: builder.mutation<CreateOrderApiResponse, CreateOrderRequest>({
            query: (orderData) => ({
                url: '/new',
                method: 'POST',
                body: orderData
            })
        }),
    })
})

export const {useNewOrderMutation} = orderApi;