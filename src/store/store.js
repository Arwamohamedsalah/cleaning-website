import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import customersReducer from './slices/customersSlice';
import workersReducer from './slices/workersSlice';
import housemaidsReducer from './slices/housemaidsSlice';
import applicationsReducer from './slices/applicationsSlice';
import messagesReducer from './slices/messagesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    customers: customersReducer,
    workers: workersReducer,
    housemaids: housemaidsReducer,
    applications: applicationsReducer,
    messages: messagesReducer,
    theme: themeReducer,
  },
});

