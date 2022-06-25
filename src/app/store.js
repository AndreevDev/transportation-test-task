import { configureStore } from '@reduxjs/toolkit';
import requestListReducer from '../features/requestList/requestListSlice';
import addressesReducer from '../features/requestList/addressesSlice';
import requestMapReducer from '../features/requestMap/requestMapSlice';

export const store = configureStore({
  reducer: {
    requestList: requestListReducer,
    addresses: addressesReducer,
    requestMap: requestMapReducer
  },
});
