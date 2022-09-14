import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getRatesAPI, getIsMultipleTaxSupportAPI } from './taxAPI'
import STATUSES from '../../../constants/apiStatus';

const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};


export const getRates = createAsyncThunk(
    'tax/getRatesAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await getRatesAPI();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);
export const isMultipleTaxSupport = createAsyncThunk(
    'tax/getIsMultipleTaxSupportAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await getIsMultipleTaxSupportAPI();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);


export const getRatesSlice = createSlice({
    name: 'getRates',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(getRates.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(getRates.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(getRates.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = getRatesSlice.actions;

export const isMultipleTaxSupportSlice = createSlice({
    name: 'isMultipleTaxSupport',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(isMultipleTaxSupport.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(isMultipleTaxSupport.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(isMultipleTaxSupport.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = isMultipleTaxSupportSlice.actions;


export default { getRatesSlice, isMultipleTaxSupportSlice };