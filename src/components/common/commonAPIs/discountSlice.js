import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { discountAPI} from './discountAPI'
import STATUSES from '../../../constants/apiStatus';
const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};
export const discount = createAsyncThunk(
    'discount/discountAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await discountAPI();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);
export const discountSlice = createSlice({
    name: 'discount',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(discount.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(discount.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(discount.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = discountSlice.actions;
export default discountSlice;


