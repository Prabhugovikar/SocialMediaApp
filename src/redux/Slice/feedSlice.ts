import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type UserDetails = {
  username: string;
  email: string;
  profileimage: string;
};

type FeedPost = {
  isLiked: boolean;
  _id: string;
  user_id: string;
  text: string;
  images: string[];
  video: string | null;
  createdAt: string | null;
  userDetails: UserDetails;
  likes: any[]; // Adjust type if likes has specific fields
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
      const response = await fetch(`http://13.233.96.187:3000/GetAllPost`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed data');
      }

      const data = await response.json();
      const userId = localStorage.getItem('userId'); // Get the current user ID

      // Modify the feed data to include 'isLiked' flag
      const modifiedFeedData = data?.data.map((item: FeedPost) => ({
        ...item,
        isLiked: item.likes.includes(userId), // Check if user ID exists in likes array
      }));

      return modifiedFeedData; // Return modified data
      // return data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    likePost: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.feedData?.find((post) => post._id === postId);
      if (post) {
        // Toggle the like status
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
          post.likes = post.likes.filter((like) => like !== userId);
        } else {
          post.likes.push(userId);
        }
        post.isLiked = !isLiked; // Toggle the like status
      }
    },
  },
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

export const { likePost } = feedSlice.actions;

export default feedSlice.reducer;
