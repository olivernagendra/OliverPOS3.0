import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCloudPrintersAPI, sendOrderToCloudPrinterAPI } from './cloudPrinterAPI';
import STATUSES from '../../../constants/apiStatus';


const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};


export const getCloudPrinters = createAsyncThunk(
    'category/getCloudPrintersAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await getCloudPrintersAPI(parameter);
            // The value we return becomes the `fulfilled` action payload
            return response;
        } catch (err) {

            return rejectWithValue(err.response.data)
        }

    }
);
export const getCloudPrintersSlice = createSlice({
    name: 'getCloudPrinters',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    // extraReducers: () => {}
    extraReducers: (builder) => {
        builder
            .addCase(getCloudPrinters.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(getCloudPrinters.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == true ? "" : action.payload.exceptions[0];
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(getCloudPrinters.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            });
    },
});
export const { } = getCloudPrintersSlice.actions;



export const sendOrderToCloudPrinter = createAsyncThunk(
    'category/sendOrderToCloudPrinterAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await sendOrderToCloudPrinterAPI(parameter);
            // The value we return becomes the `fulfilled` action payload
            return response;
        } catch (err) {

            return rejectWithValue(err.response.data)
        }

    }
);
export const sendOrderToCloudPrinterSlice = createSlice({
    name: 'sendOrderToCloudPrinter',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    // extraReducers: () => {}
    extraReducers: (builder) => {
        builder
            .addCase(sendOrderToCloudPrinter.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(sendOrderToCloudPrinter.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == true ? "" : action.payload.exceptions[0];
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(sendOrderToCloudPrinter.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            });
    },
});
export const { } = sendOrderToCloudPrinterSlice.actions;

export default { getCloudPrintersSlice, sendOrderToCloudPrinterSlice };
