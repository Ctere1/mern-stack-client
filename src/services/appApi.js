import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import jwt_decode from "jwt-decode";

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
                url: "/api/user/signup",
                method: "POST",
                body: user,
            }),
        }),

        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/api/auth/login",
                method: "POST",
                body: user,
            }),
        }),

        // logout
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload
            }),
        }),

        // delete user
        deleteUser: builder.mutation({
            query: (payload) => ({
                url: "/api/user/delete",
                method: "DELETE",
                body: payload,
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
            }),
        }),

        // get all users
        getUsers: builder.mutation({
            query: (payload) => ({
                url: "/api/user/all",
                method: "GET",
                body: payload,
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
            }),
        }),

        // update user
        updateUser: builder.mutation({
            query: (user) => ({
                url: "/api/user/update",
                method: "PUT",
                body: user,
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
            }),
        }),

        // update user
        addReferralPoint: builder.mutation({
            query: (payload) => ({
                url: "/api/user/referral",
                method: "PUT",
                body: payload,
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
            }),
        })

    }),
});

function getToken() {
    let accessToken = localStorage.getItem("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");
    const { exp } = jwt_decode(accessToken)
    // Refresh the token a minute early to avoid latency issues
    const expirationTime = (exp * 1000) - 60000
    if (Date.now() >= expirationTime) {
        let response = fetch('http://localhost:5001/api/auth/refreshToken', {
            method: 'post',
            body: { token: refreshToken }
        });
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
    }
    return localStorage.getItem("accessToken");
}

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useDeleteUserMutation, useGetUsersMutation, useUpdateUserMutation, useAddReferralPointMutation } = appApi;

export default appApi;