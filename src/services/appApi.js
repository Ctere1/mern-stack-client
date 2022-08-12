import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5001",
    }),

    endpoints: (builder) => ({
        // creating the user
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/user/signup",
                method: "POST",
                body: user,
            }),
        }),

        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/user/login",
                method: "POST",
                body: user,
            }),
        }),

        // logout
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload,
            }),
        }),

        // delete user
        deleteUser: builder.mutation({
            query: (payload) => ({
                url: "user/delete",
                method: "DELETE",
                body: payload,
            }),
        }),

        // get all users
        getUsers: builder.mutation({
            query: (payload) => ({
                url: "user/all",
                method: "GET",
                body: payload,
            }),
        }),

        // update user
        updateUser: builder.mutation({
            query: (user) => ({
                url: "user/update",
                method: "PUT",
                body: user,
            }),
        }),

        // update user
        addReferralPoint: builder.mutation({
            query: (user) => ({
                url: "user/referral",
                method: "PUT",
                body: user,
            }),
        })

    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useDeleteUserMutation, useGetUsersMutation, useUpdateUserMutation,useAddReferralPointMutation } = appApi;

export default appApi;