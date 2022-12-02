import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadProductAPI, productCountAPI,UpdateProductInventoryDBAPI } from './loadProductAPI';
import STATUSES from '../../constants/apiStatus';


const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};


export const productLoader = createAsyncThunk(
    'productLoader/productLoaderAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await loadProductAPI(parameter);
            return response;
        } catch (err) {

            return rejectWithValue(err.response.data)
        }

    }
);
// export const fetchProduct = async (parameter) => dispatch => {
//     dispatch(productLoading())
//     const response = await loadProductAPI(parameter)
//     dispatch(productReceived(response.data));

// }
export const productLoaderSlice = createSlice({
    name: 'productLoader',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        //     productLoading(state, action) {
        //         // Use a "state machine" approach for loading state instead of booleans
        //         if (state.loading === 'idle') {
        //             state.loading = 'pending'
        //         }
        //     },
        //     productReceived(state, action) {
        //         if (state.loading === 'pending') {
        //             // state.loading = 'idle'
        //             state.status = STATUSES.LOADING;
        //             state.data = "";
        //             state.error = "";
        //             state.is_success = false;
        //         }
        //     }
        // },

        extraReducers: (builder) => {
            builder
                .addCase(productLoader.pending, (state) => {
                    state.status = STATUSES.LOADING;
                    state.data = "";
                    state.error = "";
                    state.is_success = false;
                })
                .addCase(productLoader.fulfilled, (state, action) => {
                    state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                    state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                    state.error = action.payload && action.payload.is_success == false ? action.payload.exceptions[0] : action.payload ? "Fail to fetch" : "";;
                    state.is_success = action.payload && action.payload.is_success == true ? true : false;
                })
                .addCase(productLoader.rejected, (state, action) => {
                    state.status = STATUSES.IDLE;
                    state.data = "";
                    state.error = action.error;
                    state.is_success = false;
                })

        },
    }
});

//export const { productLoaderPanding, productLoaderSuccess, productLoaderFail } = productLoaderSlice.actions;
const { productLoading, productReceived } = productLoaderSlice.actions;

// Product quantity update
export const UpdateProductInventoryDB = createAsyncThunk(
    'productLoader/UpdateProductInventoryDBAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await UpdateProductInventoryDBAPI(parameter);
            return response;
        } catch (err) {

            return rejectWithValue(err.response.data)
        }

    }
);

export const UpdateProductInventoryDBSlice = createSlice({
    name: 'UpdateProductInventoryDB',
    initialState,
    reducers: {
        extraReducers: (builder) => {
            builder
                .addCase(UpdateProductInventoryDB.pending, (state) => {
                    state.status = STATUSES.LOADING;
                    state.data = "";
                    state.error = "";
                    state.is_success = false;
                })
                .addCase(UpdateProductInventoryDB.fulfilled, (state, action) => {
                    state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                    state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                    state.error = action.payload && action.payload.is_success == false ? action.payload.hasOwnProperty('message')?action.payload.message:"" : action.payload ? "Fail to fetch" : "";;
                    state.is_success = action.payload && action.payload.is_success == true ? true : false;
                })
                .addCase(UpdateProductInventoryDB.rejected, (state, action) => {
                    state.status = STATUSES.IDLE;
                    state.data = "";
                    state.error = action.error;
                    state.is_success = false;
                })

        },
    }
});

//export const { productLoaderPanding, productLoaderSuccess, productLoaderFail } = productLoaderSlice.actions;
const { } = UpdateProductInventoryDBSlice.actions;

export default {productLoaderSlice,UpdateProductInventoryDBSlice};
