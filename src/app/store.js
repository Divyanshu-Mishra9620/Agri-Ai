// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import languageReducer from '../features/languague/languagueSlice';
import { userApi } from '../features/user/userApi';
import { imagingApi } from '../features/imaging/imageApi';
import { suggestionsApi } from '../features/suggestions/suggestionsApi';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [imagingApi.reducerPath]: imagingApi.reducer,
    [suggestionsApi.reducerPath]: suggestionsApi.reducer,
    auth: authReducer,
    language: languageReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(authApi.middleware, userApi.middleware, imagingApi.middleware, suggestionsApi.middleware),
});

export default store;
