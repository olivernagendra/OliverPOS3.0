import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginSlice from './features/login/loginSlice';
// import {postApi} from '../services/post'
 //import {loginApi} from '../components/login/loginService'
export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    // counterReducer,
    // [postApi.reducerPath]: postApi.reducer,
    //[loginApi.reducerPath]: loginApi.reducer,
  }
  // ,
  // middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(loginApi.middleware)
});
