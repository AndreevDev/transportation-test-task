import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from './requestListAPI';

const initialState = {
    addresses: [],
    addressesStatus: 'idle'
};

export const fetchAddresses = createAsyncThunk(
    'addresses/fetchAddresses',
    async () => {
        const { request } = useHttp();
        return await request('http://localhost:3001/addresses');
    }
);

export const addressesSlice = createSlice({
    name: 'addresses',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.addressesStatus = 'loading';
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload;
                state.addressesStatus = 'idle';
            })
            .addCase(fetchAddresses.rejected, (state) => {
                state.addressesStatus = 'error';
            })
    }
});

export default addressesSlice.reducer;