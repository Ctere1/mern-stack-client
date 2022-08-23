import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
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
                    'Authorization': getToken(payload)
                },
            }),
        }),

        // get all users
        getUsers: builder.mutation({
            query: (user) => ({
                url: "/api/user/all",
                method: "GET",
                headers: {
                    'Authorization': getToken(user)
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
                    'Authorization': getToken(user)
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
                    'Authorization': getToken(user)
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

        // get all rooms
        getAllRooms: builder.mutation({
            query: (user) => ({
                url: "/api/room/",
                method: "GET", 
                headers: {
                    'Authorization': getToken(user)
                },
            }),
        }),

    }),
});

function getToken(user) {
    const { exp } = jwt_decode(localStorage.getItem("accessToken"))
    // Refresh the token a minute early to avoid latency issues
    const expirationTime = (exp * 1000) - 60000
    if (Date.now() >= expirationTime) {
        console.log('Token expired. Getting new token...');
        axios.post('http://localhost:5001/api/auth/refreshToken', { token: localStorage.getItem("refreshToken"), email: user.email })
            .then((response) => {
                if (response.data.accessToken) {
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    console.log('New token added');
                }
            });
    }
    return `Bearer ${localStorage.getItem("accessToken")}`;
}

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useDeleteUserMutation, useGetUsersMutation, useUpdateUserMutation, useAddReferralPointMutation, useGoogleLoginMutation, useGoogleSignupMutation, useGetAllRoomsMutation } = appApi;

export default appApi;