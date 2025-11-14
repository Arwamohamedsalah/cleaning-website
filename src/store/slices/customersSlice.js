import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customersAPI } from '../../services/api';

const initialState = {
  customers: [],
  currentCustomer: null,
  loading: false,
  error: null,
  total: 0,
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await customersAPI.getAll(params);
      if (response.success) {
        return { customers: response.data, total: response.total || 0 };
      }
      return rejectWithValue(response.message || 'فشل تحميل العملاء');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء تحميل العملاء');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await customersAPI.create(customerData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل إنشاء العميل');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء إنشاء العميل');
    }
  }
);

export const updateCustomerById = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await customersAPI.update(id, customerData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحديث العميل');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء التحديث');
    }
  }
);

export const deleteCustomerById = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customersAPI.delete(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'فشل حذف العميل');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء الحذف');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.total = action.payload.total;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create customer
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
        state.total += 1;
      })
      // Update customer
      .addCase(updateCustomerById.fulfilled, (state, action) => {
        const index = state.customers.findIndex(customer => customer._id === action.payload._id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer && state.currentCustomer._id === action.payload._id) {
          state.currentCustomer = action.payload;
        }
      })
      // Delete customer
      .addCase(deleteCustomerById.fulfilled, (state, action) => {
        state.customers = state.customers.filter(customer => customer._id !== action.payload);
        state.total -= 1;
        if (state.currentCustomer && state.currentCustomer._id === action.payload) {
          state.currentCustomer = null;
        }
      });
  },
});

export const { setCurrentCustomer, clearError } = customersSlice.actions;
export default customersSlice.reducer;

