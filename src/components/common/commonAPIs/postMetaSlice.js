import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postMetaAPI, getPostMetaAPI } from './postMetaAPI'
import STATUSES from '../../../constants/apiStatus';
const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};
export const postMeta = createAsyncThunk(
    'postMeta/postMetaAPI',
    async (parameter, { rejectWithValue }) => {

        try {
            const response = await postMetaAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);
export const getPostMeta = createAsyncThunk(
    'getMeta/getPostMetaAPI',
    async (slug, { rejectWithValue }) => {

        try {
            const response = await getPostMetaAPI(slug);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
);
export const postMetaSlice = createSlice({
    name: 'postMeta',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(postMeta.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(postMeta.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.message : "";
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(postMeta.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = postMetaSlice.actions;

export const getPostMetaSlice = createSlice({
    name: 'getPostMeta',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(getPostMeta.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(getPostMeta.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success == true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success == true ? action.payload : "");
                state.error = action.payload && action.payload.is_success == false ? action.payload.message : "";
                state.is_success = action.payload && action.payload.is_success == true ? true : false;
            })
            .addCase(getPostMeta.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            })
    },
});
export const { } = getPostMetaSlice.actions;
export default { postMetaSlice, getPostMetaSlice };


