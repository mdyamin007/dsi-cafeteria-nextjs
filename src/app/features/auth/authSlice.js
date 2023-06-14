"use client"
import { auth, provider } from "@/firebase/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithPopup, signOut } from "firebase/auth";

const user = JSON.parse(String(localStorage.getItem("user")));

const initialState = {
    loading: false,
    user: user ? user : null,
    error: null,
}

export const login = createAsyncThunk("auth/login", async (thunkAPI) => {
    try {
        const res = await signInWithPopup(auth, provider)
        // console.log(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
        return res.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
})

export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
    try {
        localStorage.removeItem("user");
        await signOut(auth)
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
        })
        builder.addCase(logout.rejected, (state, action) => {
            state.error = action.error;
        });
    }
})

export default authSlice.reducer