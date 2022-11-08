import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//import { useLoginMutation,useGetAllRegisterQuery } from '../../../components/login/loginService';
import {popupMessageAPI} from './messageAPI';
import STATUSES from '../../../constants/apiStatus';


const initialState = {
  "status": STATUSES.IDLE,
  "data": "", 
  "error":'',
  "is_success":false
};


export const popupMessage = createAsyncThunk(
  'popupMessage/popupMessageAPI',
  async (parameter,{rejectWithValue}) => {   
   
   try {
     const response = await popupMessageAPI(parameter);
          // The value we return becomes the `fulfilled` action payload
          return response;
   } catch (err) {
   
    return rejectWithValue(err.response.data)
  }
         
  }
);
export const popupMessageSlice = createSlice({
  name: 'popupMessage',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: { 
    
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
 // extraReducers: () => {}
  extraReducers: (builder) => {    
    builder     
      .addCase(popupMessage.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data="";
        state.error="";
        state.is_success=false;
      })
      .addCase(popupMessage.fulfilled, (state, action) => {       
          state.status = action.payload && action.payload.is_success==true? STATUSES.IDLE: STATUSES.ERROR;
          state.data=(action.payload && action.payload.is_success==true ?action.payload:"");  
          state.error=action.payload && action.payload.is_success==true?"": action.payload.msg?action.payload.msg:"";
          state.is_success=action.payload && action.payload.is_success==true? true: false;      
      })
      .addCase(popupMessage.rejected, (state,action) => {
        state.status = STATUSES.IDLE;
        state.data="";
        state.error = action.error;
        state.is_success=false;
      });
  },
});

 export const { } = popupMessageSlice.actions;


export default popupMessageSlice;
