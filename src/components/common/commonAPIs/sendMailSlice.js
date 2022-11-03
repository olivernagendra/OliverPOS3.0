import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendMailAPI,sendExternalMailAPI } from './sendMailAPI'
import STATUSES from '../../../constants/apiStatus';
const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};
export const sendMail = createAsyncThunk(
    'sendMail/sendMailAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await sendMailAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);
export const sendMailSlice = createSlice({
    name: 'sendMail',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(sendMail.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(sendMail.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.message : "";
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(sendMail.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = sendMailSlice.actions;


export const sendExternalMail = createAsyncThunk(
    'sendMail/sendExternalMailAPI',
    async (slug, { rejectWithValue }) => {

        try {
            const response = await sendExternalMailAPI(slug);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);
export const sendExternalMailSlice = createSlice({
    name: 'sendExternalMail',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(sendExternalMail.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(sendExternalMail.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.message : "";
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(sendExternalMail.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = sendExternalMailSlice.actions;

export default { sendMailSlice, sendExternalMailSlice };


