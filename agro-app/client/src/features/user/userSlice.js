import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userLocal',
  initialState: { localEdits: {} },
  reducers: {
    setLocalEdits: (s, a) => { s.localEdits = a.payload; },
    clearLocalEdits: (s) => { s.localEdits = {}; },
  },
});

export const { setLocalEdits, clearLocalEdits } = userSlice.actions;
export default userSlice.reducer;
