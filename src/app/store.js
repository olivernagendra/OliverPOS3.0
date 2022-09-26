import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginSlice from '../components/login/loginSlice';
import locationSlice from '../components/location/locationSlice';
import pinSlice from '../components/pinPage/pinSlice';
import registerSlice from '../components/register/registerSlice';
import { firebaseRegisterSlice } from '../components/register/firebaseRegisterSlice';
import { receiptSettingSlice } from '../components/serverSetting/receiptSettingSlice';
import taxSettingSlice from '../components/serverSetting/taxSettingSlice';

import { tileSlice, addTileSlice, deleteTileSlice } from '../components/dashboard/tiles/tileSlice';
import { CashmanagementSlice, CashmanagementSecondSlice, CashmanagementThirdSlice, CashmanagementFourthSlice, CashmanagementFifthSlice, GetOpenRegisterSlice } from '../components/cashmanagement/CashmanagementSlice';
import { productLoaderSlice } from '../components/loadProduct/loadProductSlice';
import { productCountSlice } from '../components/loadProduct/productCountSlice'
import { categorySlice } from '../components/common/commonAPIs/categorySlice';
import { attributeSlice } from '../components/common/commonAPIs/attributeSlice';
import { CustomergetPageSlice } from '../components/customer/CustomerSlice'
import { customerSlice } from '../components/common/commonAPIs/customerSlice';
import { groupSlice } from '../components/common/commonAPIs/groupSlice';
import { productSlice } from '../components/dashboard/product/productSlice';
import { CustomerSaveSlice } from '../components/customer/CustomerSlice'
import { checkStockSlice } from '../components/checkout/checkoutSlice';
import { userSlice } from '../components/common/commonAPIs/userSlice';
import { getRatesSlice, isMultipleTaxSupportSlice, getTaxRateListSlice, selectedTaxListSlice, updateTaxRateListSlice } from '../components/common/commonAPIs/taxSlice';
import { discountSlice } from '../components/common/commonAPIs/discountSlice';
import { popupMessageSlice } from '../components/common/commonAPIs/messageSlice';
//import { productQuantityInWarehouseSlice } from '../components/dashboard/slices/inventorySlice'
import inventoryReducer from '../components/dashboard/slices/inventorySlice'
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
    addTile: addTileSlice.reducer,
    deletTile: deleteTileSlice.reducer,
    cashmanagement: CashmanagementSlice.reducer,
    productloader: productLoaderSlice.reducer,
    productcount: productCountSlice.reducer,
    attribute: attributeSlice.reducer,
    category: categorySlice.reducer,
    cashmanagementgetdetail: CashmanagementSecondSlice.reducer,
    productloader: productLoaderSlice.reducer,
    // openregisterupdate: openRegisterSlice.reducer,
    customer: customerSlice.reducer,
    group: groupSlice.reducer,
    openRegister: CashmanagementThirdSlice.reducer,
    cashmanagementCloseRegister: CashmanagementFourthSlice.reducer,
    cashmanagementSaveClosingNote: CashmanagementFifthSlice.reducer,
    //openregisterupdate: openRegisterSlice.reducer,
    customer: customerSlice.reducer,
    customergetPage: CustomergetPageSlice.reducer,
    product: productSlice.reducer,

    customersave: CustomerSaveSlice.reducer,
    checkStock: checkStockSlice.reducer,
    userList: userSlice.reducer,
    getRates: getRatesSlice.reducer,
    isMultipleTaxSupport: isMultipleTaxSupportSlice.reducer,
    GetOpenRegister: GetOpenRegisterSlice.reducer,
    GetTaxRateList: getTaxRateListSlice.reducer,
    updateTaxRateList: updateTaxRateListSlice.reducer,
    selectedTaxList: selectedTaxListSlice.reducer,
    popupMessage: popupMessageSlice.reducer,
    discountList: discountSlice.reducer,
    inventories: inventoryReducer
  }
  ,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
