// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState =  {
  info: null,
  item: null,
};

const saveChat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    saveChatInfo: (state, action) => {
      state.info = action.payload;
    },
    saveChatItem: (state, action) => {
      state.item = action.payload;
    },
  },
});

export const { saveChatInfo, saveChatItem } = saveChat.actions;

export default saveChat.reducer;
