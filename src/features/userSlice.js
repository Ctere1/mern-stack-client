import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        addNotifications: (state, { payload }) => {
            if (state.newMessages[payload]) {
                state.newMessages[payload] = state.newMessages[payload] + 1;
            } else {
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, { payload }) => {
            delete state.newMessages[payload];
        },
    },

    extraReducers: (builder) => {
        // save user after login
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload.user);
        builder.addMatcher(appApi.endpoints.googleLogin.matchFulfilled, (state, { payload }) => payload.user);
        // save user after update
        builder.addMatcher(appApi.endpoints.updateUser.matchFulfilled, (state, { payload }) => payload);
        // logout: destroy user session
        builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
        // delete: destroy user
        builder.addMatcher(appApi.endpoints.deleteUser.matchFulfilled, () => null);
    },
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;