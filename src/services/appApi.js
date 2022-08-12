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
                url: "/v1/user-create",
                method: "POST",
                body: user,
            }),
        }),

        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/v1/login",
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
                url: "v1/user-delete",
                method: "DELETE",
                body: payload,
            }),
        }),

        // get all users
        getUsers: builder.mutation({
            query: (payload) => ({
                url: "v1/users",
                method: "GET",
                body: payload,
            }),
        }),

        // update user
        updateUser: builder.mutation({
            query: (user) => ({
                url: "v1/user-update",
                method: "PUT",
                body: user,
            }),
        }),

        // update user
        addReferralPoint: builder.mutation({
            query: (user) => ({
                url: "v1/referral",
                method: "PUT",
                body: user,
            }),
        })

    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useDeleteUserMutation, useGetUsersMutation, useUpdateUserMutation,useAddReferralPointMutation } = appApi;

export default appApi;