import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});

export default store;
