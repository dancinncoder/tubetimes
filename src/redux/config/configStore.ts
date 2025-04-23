import { configureStore } from "@reduxjs/toolkit";
import favoriteSlice from "../modules/favoriteSlice";

export const store = configureStore({
  reducer: {
    favoriteList: favoriteSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
