import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the shape of the media data
interface MediaData {
  images: string[];
  video: string | null;
  text: string;
  userId : string;
}

interface MediaState {
  mediaData: MediaData | null;
  loading: boolean;
  error: string | null;
}

// Initial state for media
const initialState: MediaState = {
  mediaData: null,
  loading: false,
  error: null,
};

// Create async thunk for API integration
export const sendMediaData = createAsyncThunk(
  'media/sendMediaData',
  async (mediaData: MediaData,{ rejectWithValue }) => {
    try {
    // Create a new FormData object to send images, video, and text
    const formData = new FormData();

    // Append images
    mediaData.images.forEach((image) => {
      formData.append('images', image); 
    });

    // Append video (if exists)
    if (mediaData.video) {
      formData.append('video', mediaData.video); // Add video to the FormData
    }


    formData.append('text', mediaData.text); 
    formData.append('user_id',mediaData?.userId);

    formData.forEach((value, key) => {
        console.log(key, value);
      });

    const response = await fetch(`http://13.233.96.187:3000/upload` , {
      method: 'POST',
      body: formData, 
    });
    if (!response.ok) {
        return rejectWithValue('Failed to send media data');
    }
    const data = await response.json();
    console.log("post created",data);  // Log the response data for debugging
    return data; 
  }
  catch (error) {
    return rejectWithValue(error.message || 'An unexpected error occurred'); // Catch and return the error message
  }
  }
);

// Slice to manage media data
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMediaData.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when a new request is made
      })
      .addCase(sendMediaData.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaData = action.payload; // Store the response data
      })
      .addCase(sendMediaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred'; // Set the error message
      });
  },
});

export default mediaSlice.reducer;
