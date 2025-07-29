import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AllUsersResponse, DeleteUserResponse, LoginApiResponse, LogoutResponse, RegisterApiResponse } from '../../types/apiTypes';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:3000/api/v1/user',
        credentials: 'include', // Include credentials for CORS 
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if(token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        signup: builder.mutation<RegisterApiResponse, FormData>({
            query: (userData) => ({
                url: '/new',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation<LoginApiResponse, {email: string, password: string}>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({ 
                url: '/logout',
                method: 'POST',
            }),
        }),
        deleteUser: builder.mutation<DeleteUserResponse, any>({
            query: (userId) => ({
                url: `/${userId}`,
                method: 'DELETE',
            }),
        }),
        allUsers: builder.query<AllUsersResponse, void>({
            query: () => ({
                url: '/all',
                method: 'GET',
            }),
        }),
    }),
})

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useAllUsersQuery, useDeleteUserMutation } = authApi;