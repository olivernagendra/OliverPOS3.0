import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {openRegisterAPI } from './openRegisterAPI'
import STATUSES from '../../constants/apiStatus';


const initialState = {
  "status": STATUSES.IDLE,
  "data": "", 
  "error":'',
  "is_success":false
};

export const registerupdate = createAsyncThunk(
    'openregisterupdate/openRegisterAPI',
    async (parameter,{rejectWithValue}) => {  
     
     try {
       const response = await openRegisterAPI(parameter);
            return response;
     } catch (err) {
      return rejectWithValue(err.response.data)
    }
           
    }
  );

export const openRegisterSlice = createSlice({
    name: 'openregisterupdate',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: { 
    
    },
    extraReducers: (builder) => {    
      builder 
        .addCase(registerupdate.pending, (state) => {
          state.status = STATUSES.LOADING;
          state.data="";
          state.error="";
          state.is_success=false;
        })
        .addCase(registerupdate.fulfilled, (state, action) => {       
            state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
            state.data=(action.payload && action.payload.is_success==true ?action.payload:"");  
            state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
            state.is_success=action.payload && action.payload.is_success==true? true: false;      
        })
        .addCase(registerupdate.rejected, (state,action) => {
          state.status = STATUSES.IDLE;
          state.data="";
          state.error = action.error;
          state.is_success=false;
        })
    },
  });
  
  
  
  
   export const { loginPanding, loginSuccess, loginFail } = openRegisterSlice.actions;
  
  
  // // The function below is called a selector and allows us to select a value from
  // // the state. Selectors can also be defined inline where they're used instead of
  // // in the slice file. For example: `useSelector((state: RootState) => state.login.value)`
  // export const selectCount = (state) => state.login.value;
  
  // // We can also write thunks by hand, which may contain both sync and async logic.
  // // Here's an example of conditionally dispatching actions based on current state.
  // export const incrementIfOdd = (amount) => (dispatch, getState) => {
  //   const currentValue = selectCount(getState());
  //   if (currentValue % 2 === 1) {
  //     dispatch(incrementByAmount(amount));
  //   }
  // };
  
  export default openRegisterSlice;