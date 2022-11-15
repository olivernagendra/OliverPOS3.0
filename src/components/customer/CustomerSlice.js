import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { saveAPI, updateAPI, getDetailAPI, getPageAPI, getAllEventsAPi, updateCustomerNoteAPI, updateCreditScoreAPI, saveCustomerToTempOrderAPI ,getCountryListAPI,getStateListAPI ,deleteCustomerNoteAPI } from './CustomerAPI'
import STATUSES from '../../constants/apiStatus';
import { useIndexedDB } from 'react-indexed-db';


const initialState = {
  "status": STATUSES.IDLE,
  "data": "",
  "error": '',
  "is_success": false
};



export const updateCreditScore = createAsyncThunk(
  'updateCreditScore/updateCreditScoreAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await updateCreditScoreAPI(parameter);
      //updating store credit value in index db for the customer
      if (response && response.is_success === true && response.message === "Success" && response.content != null && parameter.CustomerWpid) {
        const { update, getByID } = useIndexedDB("customers");
        var _item = await getByID(parameter.CustomerWpid);
        _item.store_credit = response.content;
        await update(_item);
        //updating store credit value in checklist and localstorage
        if (localStorage.getItem('AdCusDetail')) {
          var data = JSON.parse(localStorage.getItem('AdCusDetail'));
          if (data.WPId === parameter.CustomerWpid) {
            data.store_credit = response.content;
            localStorage.setItem('AdCusDetail', JSON.stringify(data))
            var list = localStorage.getItem('CHECKLIST') !== null ? (typeof localStorage.getItem('CHECKLIST') !== 'undefined') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null : null;
            if (list != null) {
              list.customerDetail.store_credit = response.content;
              localStorage.setItem('CHECKLIST', JSON.stringify(list))
            }
          }
        }
      }
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);



export const deleteCustomerNote = createAsyncThunk(
  'deleteCustomerNote/deleteCustomerNoteAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await deleteCustomerNoteAPI(parameter);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);

export const updateCustomerNote = createAsyncThunk(
  'updateCustomerNote/updateCustomerNoteAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await updateCustomerNoteAPI(parameter);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);


export const getAllEvents = createAsyncThunk(
  'getAllEvents/getAllEventsAPi',
  async (parameter, { rejectWithValue }) => {

    try {
      const response = await getAllEventsAPi(parameter);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);

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

      // if(response && response.is_success===true && response.message==="Success" && response.content!=null && response.content.customerDetails!=null)
      // {
      //   const { update, getByID } = useIndexedDB("customers");
      //   var _item =  await getByID(parameter);
      //   _item.store_credit=response.content.customerDetails.store_credit;
      //   await update(_item);
      // }

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

export const getCountryList = createAsyncThunk(
  'getCountryList/getCountryListAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await getCountryListAPI(parameter);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);

export const getStateList = createAsyncThunk(
  'getStateList/getStateListAPI',
  async (parameter, { rejectWithValue }) => {
    try {
      const response = await getStateListAPI(parameter);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);




export const getCountrySlice = createSlice({
  name: 'getCountryList',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getCountryList.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(getCountryList.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(getCountryList.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = getCountrySlice.actions;


export const getStateSlice = createSlice({
  name: 'getStateList',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getStateList.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(getStateList.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(getStateList.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = getStateSlice.actions;




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
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(customersave.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(customersave.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = CustomerSaveSlice.actions;


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
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(customerupdate.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(customerupdate.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});

export const { } = CustomerUpdateSlice.actions;


export const CustomerGetDetailsSlice = createSlice({
  name: 'customergetDetail',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(customergetDetail.pending, (state) => {
        state.custsiglestatus = STATUSES.LOADING;
        state.custsigledata = "";
        state.custsigleerror = "";
        state.custsigleis_success = false;
      })
      .addCase(customergetDetail.fulfilled, (state, action) => {
        state.custsiglestatus = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.custsigledata = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.custsigleerror = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.custsigleis_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(customergetDetail.rejected, (state, action) => {
        state.custsiglestatus = STATUSES.IDLE;
        state.custsigledata = "";
        state.custsigleerror = action.error;
        state.custsigleis_success = false;
      })
  },
});
export const { } = CustomerGetDetailsSlice.actions;




export const CustomergetPageSlice = createSlice({
  name: 'customergetPage',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(customergetPage.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(customergetPage.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(customergetPage.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = CustomergetPageSlice.actions;



export const getAllEventsSlice = createSlice({
  name: 'getAllEvents',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllEvents.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.message : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = getAllEventsSlice.actions;




export const updateCustomerNoteSlice = createSlice({
  name: 'updateCustomerNote',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(updateCustomerNote.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(updateCustomerNote.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(updateCustomerNote.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = updateCustomerNoteSlice.actions;


export const deleteCustomerNoteSlice = createSlice({
  name: 'deleteCustomerNote',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(deleteCustomerNote.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(deleteCustomerNote.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(deleteCustomerNote.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = deleteCustomerNoteSlice.actions;



export const updateCreditScoreSlice = createSlice({
  name: 'updateCreditScore',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(updateCreditScore.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(updateCreditScore.fulfilled, (state, action) => {
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(updateCreditScore.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = updateCreditScoreSlice.actions;

//---

export const saveCustomerToTempOrder = createAsyncThunk(
  'customersave/saveCustomerToTempOrderAPI',
  async (parameter, { rejectWithValue }) => {

    try {
      const response = await saveCustomerToTempOrderAPI(parameter.order_id, parameter.email_id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);

export const saveCustomerToTempOrderSlice = createSlice({
  name: 'saveCustomerToTempOrder',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(saveCustomerToTempOrder.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.data = "";
        state.error = "";
        state.is_success = false;
      })
      .addCase(saveCustomerToTempOrder.fulfilled, (state, action) => {
        console.log("action",action)
        state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
        state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
        state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
        state.is_success = action.payload && action.payload.is_success == true ? true : false;
      })
      .addCase(saveCustomerToTempOrder.rejected, (state, action) => {
        state.status = STATUSES.IDLE;
        state.data = "";
        state.error = action.error;
        state.is_success = false;
      })
  },
});
export const { } = saveCustomerToTempOrderSlice.actions;

export default { CustomerSaveSlice, CustomerUpdateSlice, CustomerGetDetailsSlice, CustomergetPageSlice, getAllEventsSlice, updateCustomerNoteSlice,deleteCustomerNoteSlice, updateCreditScoreSlice, saveCustomerToTempOrderSlice,getCountrySlice ,getStateSlice};

