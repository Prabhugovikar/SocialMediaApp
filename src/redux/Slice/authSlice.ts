import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { googleLogin } from "../../Pages/Login/GoogleLogin";



export const loginWithGoogle = createAsyncThunk(
    "auth/loginWithGoogle",
    async (_, { rejectWithValue }) => {
        try {
            const { username, Email, profileimage, bannerimage, Bio } = await googleLogin();

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({ username, Email, profileimage, bannerimage, Bio });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: "follow"as RequestRedirect, 
            };
            console.log('raw',raw);
            const response = await fetch(`${process.env.REACT_APP_URL}Login`,requestOptions);
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to log in with backend");
            }
            return {username, Email, profileimage,data};
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
