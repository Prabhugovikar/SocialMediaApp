import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type EditProfileState = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: EditProfileState = {
  loading: false,
  error: null,
  success: false,
};

// Async thunk to update profile
export const updateProfile = createAsyncThunk(
  'editProfile/updateProfile',
  async (
    formData: FormData,  // Accepting FormData to handle images and text
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`http://13.233.96.187:3000/Updatedetails`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log("data",data);
      localStorage.setItem('username',data?.userdata?.username);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice for profile edit
const editProfileSlice = createSlice({
  name: 'editProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default editProfileSlice.reducer;
