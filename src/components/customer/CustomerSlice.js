import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { saveAPI, updateAPI,getDetailAPI,getPageAPI } from './CustomerAPI'
import STATUSES from '../../constants/apiStatus';


const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};


export const customergetPage = createAsyncThunk(
  'customergetPage/getPageAPI',
  async (parameter, { rejectWithValue }) => {

      try {
          const response = await getPageAPI(parameter);
          return response;
      } catch (err) {
          return rejectWithValue(err.response.data)
      }
  }
);






export const customergetDetail = createAsyncThunk(
  'customergetDetail/getDetailAPI',
  async (parameter, { rejectWithValue }) => {

      try {
          const response = await getDetailAPI(parameter);
          return response;
      } catch (err) {
          return rejectWithValue(err.response.data)
      }
  }
);


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




   export const CustomerGetDetailsSlice = createSlice({
    name: 'customergetDetail',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: { 
     
    },
   
    extraReducers: (builder) => {    
      builder     
        .addCase(customergetDetail.pending, (state) => {
          state.customergetdetailsstatus = STATUSES.LOADING;
          state.customergetdetailsdata="";
          state.customergetdetailserror="";
          state.is_success=false;
        })
        .addCase(customergetDetail.fulfilled, (state, action) => {       
            state.customergetdetailsstatus = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
            state.customergetdetailsdata=(action.payload && action.payload.is_success==true ?action.payload:"");  
            state.customergetdetailserror=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
            state.is_success=action.payload && action.payload.is_success==true? true: false;      
        })
        .addCase(customergetDetail.rejected, (state,action) => {
          state.customergetdetailsstatus = STATUSES.IDLE;
          state.customergetdetailsdata="";
          state.customergetdetailserror = action.error;
          state.is_success=false;
        })
    },
  });
  
   export const {  } = CustomerGetDetailsSlice.actions;



   
   export const CustomergetPageSlice = createSlice({
    name: 'customergetPage',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: { 
     
    },
   
    extraReducers: (builder) => {    
      builder     
        .addCase(customergetPage.pending, (state) => {
          state.customergetPagesstatus = STATUSES.LOADING;
          state.customergetPagesdata="";
          state.customergetPageserror="";
          state.customergetPagesis_success=false;
        })
        .addCase(customergetPage.fulfilled, (state, action) => {       
            state.customergetPagesstatus = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
            state.customergetPagesdata=(action.payload && action.payload.is_success==true ?action.payload:"");  
            state.customergetPageserror=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
            state.customergetPagesis_success=action.payload && action.payload.is_success==true? true: false;      
        })
        .addCase(customergetPage.rejected, (state,action) => {
          state.customergetPagesstatus = STATUSES.IDLE;
          state.customergetPagesdata="";
          state.customergetPageserror = action.error;
          state.customergetPagesis_success=false;
        })
    },
  });
  
   export const {  } = CustomergetPageSlice.actions;






   export default { CustomerSaveSlice , CustomerUpdateSlice,CustomerGetDetailsSlice ,CustomergetPageSlice };

