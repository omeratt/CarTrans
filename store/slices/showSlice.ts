import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
export interface initState {
  isSideBar?: boolean;
  message?: string;
}
// Define the initial state using that type
const initialState: initState = {
  isSideBar: true,
  message: "",
};

export const showSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isSideBar = !state.isSideBar;
      return state;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      return state;
    },
  },
});

export const { toggleSideBar, setMessage } = showSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export const selectIsSideBar = (state: RootState) => state.showSlice.isSideBar;
export const selectMessage = (state: RootState) => state.showSlice.message;

export default showSlice.reducer;
