import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import mediaReducer from "./Slice/postSlice"; 
import profileReducer from "./Slice/profileSlice";
import feedReducer from './Slice/feedSlice';
import editProfileReducer from "./Slice/editSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    media: mediaReducer, 
    profile : profileReducer,
    feed: feedReducer, 
    editProfile: editProfileReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
