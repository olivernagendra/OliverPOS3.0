import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateOrderStatusAPI } from './updateOrderStatusAPI'
import STATUSES from '../../../constants/apiStatus';
const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};
export const updateOrderStatus = createAsyncThunk(
    'updateOrderStatus/updateOrderStatusAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await updateOrderStatusAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);

export const updateOrderStatusSlice = createSlice({
    name: 'updateOrderStatus',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.message : "";
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = updateOrderStatusSlice.actions;

export default  updateOrderStatusSlice ;


