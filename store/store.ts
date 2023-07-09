import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import storage from "redux-persist/lib/storage/session";

// Import your reducers here
// import rootReducer from "./reducer";
import userSlice from "./slices/userSlice";
import showSlice from "./slices/showSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import persistStore from "redux-persist/es/persistStore";
import {
  persistStore,
  persistReducer,
  PersistConfig,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Configuration for redux-persist
const userConfig = {
  key: "user",
  storage: storage,
};

// Create a persisted reducer
const userReducer = persistReducer(userConfig, userSlice);
const combinedReducer = combineReducers({
  user: userReducer,
  showSlice,
});
// Create the store with persisted reducer
// const store = configureStore({
//   reducer: combinedReducer,
// });
export const store = configureStore({
  reducer: combinedReducer,
  // devTools: true,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export let persistor = persistStore(store);
export default store;
