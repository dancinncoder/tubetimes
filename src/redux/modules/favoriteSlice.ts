import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TypeFavoriteState, TypeFavoriteStationsList } from "../../type/types";

//InitialState
const initialState: TypeFavoriteState = {
  favoriteList: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<TypeFavoriteStationsList>) => {
      state.favoriteList.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favoriteList = state.favoriteList.filter(
        (station) => station.id !== action.payload
      );
    },
    setFavorite: (state, action: PayloadAction<TypeFavoriteStationsList[]>) => {
      state.favoriteList = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorite } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
