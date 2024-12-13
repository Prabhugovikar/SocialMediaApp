import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type UserProfile = {
  Bio: any;
  _id: string;
  Email: string;
  username: string;
  profileimage: string;
  bannerimage: string;
};

type ProfilePost = {
    _id: string;
    user_id: string;
    text: string;
    images: string[];
    video: string | null;
  };
  
  type ProfileState = {
    profileData: ProfilePost[] | null;
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
  };
  
  const initialState: ProfileState = {
    profileData: null,
    userProfile: null,
    loading: false,
    error: null,
  };

// Async thunk to fetch profile data
export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://13.233.96.187:3000/getUploadById`, {
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

      const result = await response.json();
      return {
        profileData: result?.data,
        userProfile: result?.userprofile[0], 
      };
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
        state.profileData = action.payload.profileData;
        state.userProfile = action.payload.userProfile;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
