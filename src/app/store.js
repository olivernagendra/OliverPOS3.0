import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import {postApi} from '../services/post'
import {loginApi} from '../services/loginService'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [postApi.reducerPath]: postApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },
});
