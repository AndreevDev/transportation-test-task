import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from './requestListAPI';

const requestListAdapter = createEntityAdapter();

const initialState = requestListAdapter.getInitialState({
    requestListLoadingStatus: 'idle'
});

export const fetchRequestList = createAsyncThunk(
    'requestList/fetchRequestList',
    async () => {
        const { request } = useHttp();
        return await request('http://localhost:3001/requests');
    }
);

export const requestListSlice = createSlice({
    name: 'requestList',
    initialState,
    reducers: {
        requestItemUpdated: requestListAdapter.updateOne
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestList.pending, (state) => {
                state.requestListLoadingStatus = 'loading';
            })
            .addCase(fetchRequestList.fulfilled, (state, action) => {
                state.requestListLoadingStatus = 'idle';
                requestListAdapter.setAll(state, action.payload);
            })
            .addCase(fetchRequestList.rejected, (state) => {
                state.requestListLoadingStatus = 'error';
            })
    }
});

export const { selectAll } = requestListAdapter.getSelectors((state) => state.requestList);

export const { requestItemUpdated } = requestListSlice.actions;

export default requestListSlice.reducer;