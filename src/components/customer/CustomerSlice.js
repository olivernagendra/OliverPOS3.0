import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { saveAPI, updateAPI } from './CustomerAPI'
import STATUSES from '../../constants/apiStatus';


const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};


export const customersave = createAsyncThunk(
    'customersave/saveAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await saveAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);

export const customerupdate = createAsyncThunk(
    'customerupdate/updateAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await updateAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);




export const CustomerSaveSlice = createSlice({
    name: 'customersave',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: { 
     
    },
   
    extraReducers: (builder) => {    
      builder     
        .addCase(customersave.pending, (state) => {
          state.status = STATUSES.LOADING;
          state.data="";
          state.error="";
          state.is_success=false;
        })
        .addCase(customersave.fulfilled, (state, action) => {       
            state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
            state.data=(action.payload && action.payload.is_success==true ?action.payload:"");  
            state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
            state.is_success=action.payload && action.payload.is_success==true? true: false;      
        })
        .addCase(customersave.rejected, (state,action) => {
          state.status = STATUSES.IDLE;
          state.data="";
          state.error = action.error;
          state.is_success=false;
        })
    },
  });
  
   export const {  } = CustomerSaveSlice.actions;



   

export const CustomerUpdateSlice = createSlice({
    name: 'customerupdate',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: { 
     
    },
    extraReducers: (builder) => {    
      builder     
        .addCase(customerupdate.pending, (state) => {
          state.status = STATUSES.LOADING;
          state.data="";
          state.error="";
          state.is_success=false;
        })
        .addCase(customerupdate.fulfilled, (state, action) => {       
            state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
            state.data=(action.payload && action.payload.is_success==true ?action.payload:"");  
            state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
            state.is_success=action.payload && action.payload.is_success==true? true: false;      
        })
        .addCase(customerupdate.rejected, (state,action) => {
          state.status = STATUSES.IDLE;
          state.data="";
          state.error = action.error;
          state.is_success=false;
        })
    },
  });
  
   export const {  } = CustomerUpdateSlice.actions;

   export default { CustomerSaveSlice , CustomerUpdateSlice};