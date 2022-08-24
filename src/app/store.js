import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginSlice from '../components/login/loginSlice';
import locationSlice from '../components/location/locationSlice';

import pinSlice from '../components/pinPage/pinSlice';

import registerSlice from '../components/register/registerSlice';
import { firebaseRegisterSlice } from '../components/register/firebaseRegisterSlice';
import { receiptSettingSlice } from '../components/serverSetting/receiptSettingSlice';
import taxSettingSlice from '../components/serverSetting/taxSettingSlice';
import {tileSlice} from '../components/homePage/tiles/tileSlice';
// import {postApi} from '../services/post'
 //import {loginApi} from '../components/login/loginService'
export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    location: locationSlice.reducer,
    pin:pinSlice.reducer,
    register: registerSlice.reducer,
    firebaseRegister:firebaseRegisterSlice.reducer,
    receiptsetting:  receiptSettingSlice.reducer,
    taxsetting:  taxSettingSlice.reducer,
    tile:tileSlice.reducer
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
