import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isListening: false,
  isSpeaking: false,
  currentText: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setListening: (state, action) => {
      state.isListening = action.payload;
    },
    setSpeaking: (state, action) => {
      state.isSpeaking = action.payload;
    },
    setCurrentText: (state, action) => {
      state.currentText = action.payload;
    },
    clearCurrentText: (state) => {
      state.currentText = "";
    },
  },
});

export const {
  addMessage,
  setListening,
  setSpeaking,
  setCurrentText,
  clearCurrentText,
} = chatSlice.actions;

export default chatSlice.reducer;
