import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productCountAPI } from './loadProductAPI';
import STATUSES from '../../constants/apiStatus';


const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};

export const productCount = createAsyncThunk(
    'productLoader/totalProduct',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await productCountAPI(parameter);
            // The value we return becomes the `fulfilled` action payload
            return response;
        } catch (err) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data)
        }
    }
);

export const productCountSlice = createSlice({
    name: 'productLoader',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(productCount.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(productCount.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(productCount.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })

    },
});

//export const { productLoaderPanding, productLoaderSuccess, productLoaderFail } = productLoaderSlice.actions;


export default productCountSlice;
