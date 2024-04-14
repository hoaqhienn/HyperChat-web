// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  friend: null,
  
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    getFriendSuccess: (state, action) => {
      state.friend = action.payload;
    },
    
  },
});

export const { getFriendSuccess } = friendSlice.actions;

export default friendSlice.reducer;