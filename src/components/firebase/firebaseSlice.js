import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//import { useLoginMutation,useGetAllRegisterQuery } from '../../../components/login/loginService';
import { sendTokenAPI, removeSubscriptionAPI, registerAccessedAPI, pingRegisterAPI } from './firebaseAPI';
import STATUSES from '../../constants/apiStatus';


const initialState = {
    "status": STATUSES.IDLE,
    "data": "",
    "error": '',
    "is_success": false
};

//send token
export const sendToken = createAsyncThunk(
    'register/sendTokenAPI',
    async (parameter, { rejectWithValue }) => {
        try {
            const response = await sendTokenAPI(parameter.currentToken,parameter.ClientGuid);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }

    }
);
export const sendTokenSlice = createSlice({
    name: 'sendToken',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendToken.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(sendToken.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success === true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success === true ? action.payload : "");
                state.error = action.payload && action.payload.is_success === false ? action.payload.message : action.payload ? "Fail to fetch" : "";
                state.is_success = action.payload && action.payload.is_success === true ? true : false;
            })
            .addCase(sendToken.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            });
    },
});
export const { } = sendTokenSlice.actions;
//--

//remove Subscription
export const removeSubscription = createAsyncThunk(
    'register/removeSubscriptionAPI',
    async (parameter, { rejectWithValue }) => {
        try {
            const response = await removeSubscriptionAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }

    }
);
export const removeSubscriptionSlice = createSlice({
    name: 'removeSubscription',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(removeSubscription.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(removeSubscription.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success === true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success === true ? action.payload : "");
                state.error = action.payload && action.payload.is_success === false ? action.payload.message : action.payload ? "Fail to fetch" : "";
                state.is_success = action.payload && action.payload.is_success === true ? true : false;
            })
            .addCase(removeSubscription.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            });
    },
});
export const { } = removeSubscriptionSlice.actions;
//--

//register Accessed
export const registerAccessed = createAsyncThunk(
    'register/registerAccessedAPI',
    async (parameter, { rejectWithValue }) => {
        try {
            const response = await registerAccessedAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }

    }
);
export const registerAccessedSlice = createSlice({
    name: 'registerAccessed',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerAccessed.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(registerAccessed.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success === true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success === true ? action.payload : "");
                state.error = action.payload && action.payload.is_success === false ? action.payload.message : action.payload ? "Fail to fetch" : "";
                state.is_success = action.payload && action.payload.is_success === true ? true : false;
            })
            .addCase(registerAccessed.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            });
    },
});
export const { } = registerAccessedSlice.actions;
//--

//ping Register
export const pingRegister = createAsyncThunk(
    'register/pingRegisterAPI',
    async (parameter, { rejectWithValue }) => {
        try {
            const response = await pingRegisterAPI(parameter);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }

    }
);
export const pingRegisterSlice = createSlice({
    name: 'pingRegister',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(pingRegister.pending, (state) => {
                state.status = STATUSES.LOADING;
                state.data = "";
                state.error = "";
                state.is_success = false;
            })
            .addCase(pingRegister.fulfilled, (state, action) => {
                state.status = action.payload && action.payload.is_success === true ? STATUSES.IDLE : STATUSES.ERROR;
                state.data = (action.payload && action.payload.is_success === true ? action.payload : "");
                state.error = action.payload && action.payload.is_success === false ? action.payload.message : action.payload ? "Fail to fetch" : "";
                state.is_success = action.payload && action.payload.is_success === true ? true : false;
            })
            .addCase(pingRegister.rejected, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = "";
                state.error = action.error;
                state.is_success = false;
            });
    },
});
export const { } = pingRegisterSlice.actions;
//--
export default { sendTokenSlice, removeSubscriptionSlice,registerAccessedSlice,pingRegisterSlice};
