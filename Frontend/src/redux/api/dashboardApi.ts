import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashboardStatsResponse } from "../../types/apiTypes";


export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api/v1/dashboard",
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
        stats: builder.query<DashboardStatsResponse, void>({
            query: () => ({
                url: "/stats",
                method: "GET",
            }),
        }),
        pie: builder.query<any, void>({
            query: () => ({
                url: "/pie",
                method: "GET",
            })
        }),
        bar: builder.query<any, void>({
            query: () => ({
                url: "/bar",
                method: "GET",
            })
        }),
        line: builder.query<any, void>({
            query: () => ({
                url: "/line",
                method: "GET",
            })
        }),
    })
})

export const {useBarQuery, useLineQuery, usePieQuery, useStatsQuery} = dashboardApi;