// // import { createSlice } from '@reduxjs/toolkit';

// // const initialAuth = {
// //   user: null,
// //   accessToken: null,
// //   refreshToken: null,
// //   isAuthenticated: false,
// // };

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState: initialAuth,
// //   reducers: {
// //     setCredentials: (state, action) => {
// //       const { accessToken, refreshToken, user } = action.payload;
// //       state.accessToken = accessToken;
// //       state.refreshToken = refreshToken;
// //       state.user = user;
// //       state.isAuthenticated = !!accessToken;
// //     },
// //     clearCredentials: (state) => {
// //       state.accessToken = null;
// //       state.refreshToken = null;
// //       state.user = null;
// //       state.isAuthenticated = false;
// //     },
// //     updateUser: (state, action) => {
// //       state.user = { ...state.user, ...action.payload };
// //     },
// //   },
// // });

// // export const { setCredentials, clearCredentials, updateUser } = authSlice.actions;
// // export default authSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const loadState = () => {
//   try {
//     const serializedState = localStorage.getItem('authState');
//     return serializedState ? JSON.parse(serializedState) : {};
//   } catch (err) {
//     return {};
//   }
// };

// const initialState = {
//   user: null,
//   accessToken: null,
//   ...loadState()
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, { payload: { user, accessToken } }) => {
//       state.user = user;
//       state.accessToken = accessToken;
//       // Save to localStorage
//       localStorage.setItem('authState', JSON.stringify({ user, accessToken }));
//     },
//     clearCredentials: (state) => {
//       state.user = null;
//       state.accessToken = null;
//       // Clear from localStorage
//       localStorage.removeItem('authState');
//     },
//   },
// });

// export const { setCredentials, clearCredentials } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

// Utility to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    return serializedState ? JSON.parse(serializedState) : {};
  } catch (err) {
    return {};
  }
};

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  ...loadState(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload: { user, accessToken, refreshToken } }) => {
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = !!accessToken;

      // Save to localStorage
      localStorage.setItem(
        'authState',
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        })
      );
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      localStorage.removeItem('authState');
    },
    updateUser: (state, { payload }) => {
      state.user = { ...state.user, ...payload };

      // Update in localStorage
      localStorage.setItem(
        'authState',
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        })
      );
    },
  },
});

export const { setCredentials, clearCredentials, updateUser } = authSlice.actions;
export default authSlice.reducer;
