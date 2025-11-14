import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  total: 0,
  filters: {
    status: 'all',
    dateRange: null,
    serviceType: 'all',
  },
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getAll(params);
      if (response.success) {
        return { orders: response.data, total: response.total || 0 };
      }
      return rejectWithValue(response.message || 'فشل تحميل الطلبات');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء تحميل الطلبات');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.create(orderData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل إنشاء الطلب');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء إنشاء الطلب');
    }
  }
);

export const updateOrderById = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.update(id, orderData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحديث الطلب');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء التحديث');
    }
  }
);

export const deleteOrderById = createAsyncThunk(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.delete(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'فشل حذف الطلب');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء الحذف');
    }
  }
);

export const confirmOrderById = createAsyncThunk(
  'orders/confirmOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.confirm(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تأكيد الطلب');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء تأكيد الطلب');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update order
      .addCase(updateOrderById.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      // Delete order
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload);
        state.total -= 1;
        if (state.currentOrder && state.currentOrder._id === action.payload) {
          state.currentOrder = null;
        }
      })
      // Confirm order
      .addCase(confirmOrderById.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const { setCurrentOrder, setFilters, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;

