import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dispatchAddress: [],
    shippingAddress: [],
    status: 'idle',
  };

export const requestMapSlice = createSlice({
    name: 'requestMap',
    initialState,
    reducers: {
        locationChanged: (state, action) => {
            if (action.payload.dispatchAddress) {
                state.dispatchAddress = action.payload.dispatchAddress;
            }
            if (action.payload.shippingAddress) {
                state.shippingAddress = action.payload.shippingAddress;
            }
        }
    }
});

export const { locationChanged } = requestMapSlice.actions;

export default requestMapSlice.reducer;