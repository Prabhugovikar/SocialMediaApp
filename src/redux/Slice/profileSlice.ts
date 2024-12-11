import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type ProfilePost = {
    _id: string;
    user_id: string;
    text: string;
    images: string[];
    video: string | null;
  };
  
  type ProfileState = {
    profileData: ProfilePost[] | null;
    loading: boolean;
    error: string | null;
  };
  
  const initialState: ProfileState = {
    profileData: null,
    loading: false,
    error: null,
  };

// Async thunk to fetch profile data
export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}getUploadById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            "user_id" : userId,
         }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      return data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
