import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cashRecordsAPI ,getDetailsAPI } from './CashManagementAPI'
import STATUSES from '../../constants/apiStatus';


const initialState = {
  "status": STATUSES.IDLE,
  "data": "", 
  "error":'',
  "is_success":false
};

export const getDetails = createAsyncThunk(
    'cashmanagement/getDetailsAPI',
    async (parameter,{rejectWithValue}) => {   
      // const response =  getDetailsAPI(parameter);
      // // The value we return becomes the `fulfilled` action payload
      // console.log("test",response.json())
      // return response.json();
  
     try {
       const response = await getDetailsAPI(parameter);
            // The value we return becomes the `fulfilled` action payload
            return response;
     } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data)
    }
           
    }
  );

  export const cashRecords = createAsyncThunk(
    'cashmanagement/cashRecordsAPI',
    async (parameter,{rejectWithValue}) => {   
      // const response =  cashRecordsAPI(parameter);
      // // The value we return becomes the `fulfilled` action payload
      // console.log("test",response.json())
      // return response.json();
  
     try {
       const response = await cashRecordsAPI(parameter);
            // The value we return becomes the `fulfilled` action payload
            return response;
     } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data)
    }
           
    }
  );



export const CashmanagementSlice = createSlice({
    name: 'cashmanagement',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: { 
      // loginPanding:(state)=>{
      //   state.status=STATUSES.LOADING;
      //   state.data=""
      // },
      // loginSuccess:(state,action)=>{
      //   state.status=STATUSES.IDLE;
      //   state.error='';
      //   state.data=action.payload
      // },
      // loginFail:(state,action)=>{
      //   state.status=STATUSES.ERROR;    
      //   state.data="";
      //   state.error=action.payload;
      // }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
   // extraReducers: () => {}
    extraReducers: (builder) => {    
      builder     
        .addCase(cashRecords.pending, (state) => {
          state.status = STATUSES.LOADING;
          state.data="";
          state.error="";
          state.is_success=false;
        })
        .addCase(cashRecords.fulfilled, (state, action) => {       
            state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
            state.data=(action.payload && action.payload.is_success==true ?action.payload:"");  
            state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
            state.is_success=action.payload && action.payload.is_success==true? true: false;      
        })
        .addCase(cashRecords.rejected, (state,action) => {
          state.status = STATUSES.IDLE;
          state.data="";
          state.error = action.error;
          state.is_success=false;
        })
        .addCase(getDetails.pending, (state) => {
          state.status = STATUSES.LOADING;
          state.data="";
          state.error="";
          state.is_success=false;
        })
        .addCase(getDetails.fulfilled, (state, action) => {       
            state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
            state.data=(action.payload && action.payload.is_success==true ?action.payload:"");  
            state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
            state.is_success=action.payload && action.payload.is_success==true? true: false;      
        })
        .addCase(getDetails.rejected, (state,action) => {
          state.status = STATUSES.IDLE;
          state.data="";
          state.error = action.error;
          state.is_success=false;
        })
    },
  });
  
  
  
  
   export const { loginPanding, loginSuccess, loginFail } = CashmanagementSlice.actions;
  
  
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
  
  export default CashmanagementSlice;