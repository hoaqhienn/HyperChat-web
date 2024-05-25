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
    updateChatInfo: (state, action) => {
      // Assuming action.payload is an object containing updated information
      state.info = { ...state.info, ...action.payload };
    },
  },
});

export const { saveChatInfo, saveChatItem, updateChatInfo } = saveChat.actions;

export default saveChat.reducer;