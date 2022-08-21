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
            query: (user) => ({
                url: "/api/user/all",
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${getToken(user)}`
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
                    'Authorization': `Bearer ${getToken(user)}`
                },
            }),
        }),

        // update user point via referral code
        addReferralPoint: builder.mutation({
            query: (user) => ({
                url: "/api/user/referral",
                method: "PUT",
                body: user,
                headers: {
                    'Authorization': `Bearer ${getToken(user)}`
                },
            }),
        }),

        // handle Google login
        googleLogin: builder.mutation({
            query: (payload) => ({
                url: "/api/auth/googleLogin",
                method: "POST",
                body: payload
            }),
        }),

        // handle Google Signup
        googleSignup: builder.mutation({
            query: (payload) => ({
                url: "/api/auth/googleSignup",
                method: "POST",
                body: payload
            }),
        }),

    }),
});

function getToken(user) {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const { exp } = jwt_decode(accessToken)
    // Refresh the token a minute early to avoid latency issues
    const expirationTime = (exp * 1000) - 60000
    if (Date.now() >= expirationTime) {
        console.log('Token expired. Getting new token...');
        fetch('http://localhost:5001/api/auth/refreshToken', {
            method: 'POST',
            body: { token: refreshToken, email: user.email }
        }).then((response) => {
            if (response.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                console.log('New token added');
            }
        });
    }
    return localStorage.getItem("accessToken");
}

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useDeleteUserMutation, useGetUsersMutation, useUpdateUserMutation, useAddReferralPointMutation, useGoogleLoginMutation, useGoogleSignupMutation } = appApi;

export default appApi;