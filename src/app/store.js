import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginSlice from '../components/login/loginSlice';
import locationSlice from '../components/location/locationSlice';
import pinSlice from '../components/pinPage/pinSlice';
import registerSlice from '../components/register/registerSlice';
import { firebaseRegisterSlice } from '../components/register/firebaseRegisterSlice';
import { receiptSettingSlice } from '../components/serverSetting/receiptSettingSlice';
import taxSettingSlice from '../components/serverSetting/taxSettingSlice';

import { tileSlice } from '../components/dashboard/tiles/tileSlice';
import { CashmanagementSlice, CashmanagementSecondSlice, CashmanagementThirdSlice, CashmanagementFourthSlice, CashmanagementFifthSlice } from '../components/cashmanagement/CashmanagementSlice';
import { productLoaderSlice } from '../components/loadProduct/loadProductSlice';
import { productCountSlice } from '../components/loadProduct/productCountSlice'
import { categorySlice } from '../components/common/commonAPIs/categorySlice';
import { attributeSlice } from '../components/common/commonAPIs/attributeSlice';
import {CustomergetPageSlice} from '../components/customer/CustomerSlice'
//import { openRegisterSlice } from '../components/openregister/openRegisterSlice'
import { customerSlice } from '../components/common/commonAPIs/customerSlice';


// import {postApi} from '../services/post'
//import {loginApi} from '../components/login/loginService'
export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    location: locationSlice.reducer,
    pin: pinSlice.reducer,
    register: registerSlice.reducer,
    firebaseRegister: firebaseRegisterSlice.reducer,
    receiptsetting: receiptSettingSlice.reducer,
    taxsetting: taxSettingSlice.reducer,
    tile: tileSlice.reducer,
    cashmanagement: CashmanagementSlice.reducer,
    productloader: productLoaderSlice.reducer,
    productcount: productCountSlice.reducer,
    attribute: attributeSlice.reducer,
    category: categorySlice.reducer,
    cashmanagementgetdetail: CashmanagementSecondSlice.reducer,
    openRegister: CashmanagementThirdSlice.reducer,
    cashmanagementCloseRegister: CashmanagementFourthSlice.reducer,
    cashmanagementSaveClosingNote: CashmanagementFifthSlice.reducer,
    //openregisterupdate: openRegisterSlice.reducer,
    customer: customerSlice.reducer,
    customergetPage:CustomergetPageSlice.reducer

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
