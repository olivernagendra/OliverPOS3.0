import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginSlice from './features/login/loginSlice';
import locationSlice from '../components/location/locationSlice';
import pinSlice from '../components/pinPage/pinSlice';
// import {postApi} from '../services/post'
 //import {loginApi} from '../components/login/loginService'
export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    location: locationSlice.reducer,
    pin:pinSlice.reducer
    // counterReducer,
    // [postApi.reducerPath]: postApi.reducer,
    //[loginApi.reducerPath]: loginApi.reducer,
  }
   ,
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});
