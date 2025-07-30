import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, CreateOrderApiResponse, CreateOrderRequest, DeleteOrderResponse, MyOrdersResponse, SingleOrderDetailsResponse, UpdateOrderResponse } from "../../types/apiTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/order`,
        credentials: "include", // Include credentials for CORS
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['orders'],
    endpoints: (builder) => ({
        newOrder: builder.mutation<CreateOrderApiResponse, CreateOrderRequest>({
            query: (orderData) => ({
                url: '/new',
                method: 'POST',
                body: orderData
            }),
            invalidatesTags: ["orders"],
        }),
        updateOrder: builder.mutation<UpdateOrderResponse, string>({
            query: (orderId) => ({
                url: `/${orderId}`,
                method: "PUT",
            }),
            invalidatesTags: ["orders"],
        }),
        deleteOrder: builder.mutation<DeleteOrderResponse, string>({
            query: (orderId) => ({
                url: `/${orderId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),
        myOrders: builder.query<MyOrdersResponse, string>({
            query: (userId) => ({
                url: `/myOrder?_id=${userId}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
        allOrders: builder.query<AllOrdersResponse, void>({
            query: () => ({
                url: "/allAdmin",
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
        singleOrderDetails: builder.query<SingleOrderDetailsResponse, string>({
            query: (orderId) => ({
                url: `/${orderId}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
    })
})

export const {
    useNewOrderMutation,
    useDeleteOrderMutation,
    useUpdateOrderMutation,
    useMyOrdersQuery,
    useAllOrdersQuery,
    useSingleOrderDetailsQuery,
} = orderApi;