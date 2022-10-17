import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllAPI,getDetailAPI,getFilteredActivitiesAPI } from './ActivityAPI'
import STATUSES from '../../constants/apiStatus';

const initialState = {
  "status": STATUSES.IDLE,
  "data": "",
  "error": '',
  "is_success": false
};



export const getFilteredActivities = createAsyncThunk(
  'getFilteredActivities/getFilteredActivitiesAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await getFilteredActivitiesAPI(parameter);
      return response;
    } catch (err) {

      return rejectWithValue(err.response.data)
    }
  }
);

export const getFilteredActivitiesSlice = createSlice({
  name: 'getFilteredActivities',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: { 
   
  },
 
  extraReducers: (builder) => {    
    builder     
      .addCase(getFilteredActivities.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data="";
        state.error="";
        state.is_success=false;
      })
      .addCase(getFilteredActivities.fulfilled, (state, action) => { 
       // console.log("action",action)      
          state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
          state.data=(action.payload);  
          state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
          state.is_success=action.payload && action.payload.is_success==true? true: false;      
      })
      .addCase(getFilteredActivities.rejected, (state,action) => {
        state.status = STATUSES.IDLE;
        state.data="";
        state.error = action.error;
        state.is_success=false;
      })
  },
});
 export const {  } = getFilteredActivitiesSlice.actions;


export const activityRecords = createAsyncThunk(
  'activityRecords/getAllAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await getAllAPI(parameter);
      return response;
    } catch (err) {

      return rejectWithValue(err.response.data)
    }
  }
);







export const getAllActivityListSlice = createSlice({
  name: 'activityRecords',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: { 
   
  },
 
  extraReducers: (builder) => {    
    builder     
      .addCase(activityRecords.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data="";
        state.error="";
        state.is_success=false;
      })
      .addCase(activityRecords.fulfilled, (state, action) => { 
      
          state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
          state.data=(action.payload);  
          state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
          state.is_success=action.payload && action.payload.is_success==true? true: false;      
      })
      .addCase(activityRecords.rejected, (state,action) => {
        state.status = STATUSES.IDLE;
        state.data="";
        state.error = action.error;
        state.is_success=false;
      })
  },
});
 export const {  } = getAllActivityListSlice.actions;


 
export const getDetail = createAsyncThunk(
  'activityGetDetail/getDetailAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await getDetailAPI(parameter);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);



export const getDetailSlice = createSlice({
  name: 'activityGetDetail',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: { 
   
  },
 
  extraReducers: (builder) => {    
    builder     
      .addCase(getDetail.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data="";
        state.error="";
        state.is_success=false;
      })
      .addCase(getDetail.fulfilled, (state, action) => {  
          state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
          state.data=(action.payload && action.payload.is_success==true ?action.payload:"");  
          state.error=action.payload && action.payload.is_success==false? action.payload.exceptions[0]: action.payload?"Fail to fetch":"";;
          state.is_success=action.payload && action.payload.is_success==true? true: false;      
      })
      .addCase(getDetail.rejected, (state,action) => {
        state.status = STATUSES.IDLE;
        state.data="";
        state.error = action.error;
        state.is_success=false;
      })
  },
});  
 export const {  } = getDetailSlice.actions;









 export default {getAllActivityListSlice,getDetailSlice,getFilteredActivitiesSlice}


