import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserState, UserContracts, ContractState } from "./types";
import { RootState } from "../store";
// import { RootState } from "./store";

// Define the initial state using that type
const initialState: UserState = {
  _id: "",
  name: "New User",
  email: "",
  emailFromRegister: "",
  password: "",
  img: undefined,
  isSignIn: false,
  token: "",
  contracts: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    login: (state, action: PayloadAction<UserState>) => {
      state = { ...state, ...action.payload };
      console.log({ state });
      return state;
    },
    logout: (state) => {
      state = { ...initialState };
      return state;
    },
    setContracts: (state, action: PayloadAction<UserContracts>) => {
      state.contracts = { ...state.contracts, ...action.payload };
      return state;
    },
    setSendingContract: (state, action: PayloadAction<ContractState>) => {
      // const { _id, to, ...rest } = action.payload;
      // if (state.contracts && state.contracts.sending) {
      //   const index = state.contracts.sending.findIndex(
      //     (cont) => cont._id == _id
      //   );
      //   if (~index && state.contracts && state.contracts.sending[index]) {
      //     state.contracts.sending[index] = {
      //       ...state.contracts.sending[index],
      //       to: { ...state.contracts.sending[index].to, email: to?.email },
      //       ...rest,
      //     };
      //   }
      // }
      return state;
    },
    deleteContractById: (state, action: PayloadAction<string>) => {
      if (state.contracts && state.contracts.sending) {
        const index = state.contracts.sending.findIndex(
          (cont) => cont.contractId == action.payload
        );
        if (~index && state.contracts && state.contracts.sending[index]) {
          state.contracts.sending.splice(index, 1);
          console.log("deleted");
        }
      }
      return state;
    },
    setReceivingContract: (state, action: PayloadAction<ContractState>) => {
      // const { _id, confirm, decline } = action.payload;
      // console.log(_id, confirm, decline);
      // if (state.contracts && state.contracts.receive) {
      //   const index = state.contracts.receive.findIndex(
      //     (cont) => cont._id == _id
      //   );
      //   console.log(index);
      //   if (~index && state.contracts && state.contracts.receive[index]) {
      //     console.log("before", state.contracts.receive[index]);
      //     state.contracts.receive[index] = {
      //       ...state.contracts.receive[index],
      //       confirm,
      //       decline,
      //     };
      //     console.log("after", state.contracts.receive[index]);
      //   }
      // }
      return state;
    },
  },
});

export const {
  setUser,
  login,
  logout,
  setContracts,
  setSendingContract,
  deleteContractById,
  setReceivingContract,
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;
export const selectUserToken = (state: RootState) => state.user.token;
export const selectIsSignIn = (state: RootState) => state.user.isSignIn;
export const selectEmailFromRegister = (state: RootState) =>
  state.user.emailFromRegister;
export const selectContracts = (state: RootState) => state.user.contracts;
export default userSlice.reducer;
