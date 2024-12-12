import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type FeedPost = {
  _id: string;
  user_id: string;
  text: string;
  images: string[];
  video: string | null;
  createdAt: string | null;
};

type FeedState = {
  feedData: FeedPost[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  feedData: null,
  loading: false,
  error: null,
};

// Async thunk to fetch feed data
export const fetchFeedData = createAsyncThunk(
  'feed/fetchFeedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}GetAllPost`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed data');
      }

      const data = await response.json();
      return data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Feed slice
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedData.fulfilled, (state, action) => {
        state.loading = false;
        state.feedData = action.payload;
      })
      .addCase(fetchFeedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default feedSlice.reducer;
