import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { housemaidsAPI } from '../../services/api.js';

const initialState = {
  housemaids: [],
  currentHousemaid: null,
  loading: false,
  error: null,
  total: 0,
  filters: {
    status: 'all',
    nationality: 'all',
    skills: [],
  },
};

// Async thunks
export const fetchHousemaids = createAsyncThunk(
  'housemaids/fetchHousemaids',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching housemaids from API...');
      const response = await housemaidsAPI.getAll(params);
      console.log('📥 API Response:', response);
      
      // Handle different response formats
      if (response.success) {
        const housemaids = response.data || response.housemaids || [];
        const total = response.total || response.count || housemaids.length;
        console.log(`✅ Found ${housemaids.length} housemaids (total: ${total})`);
        return { housemaids, total };
      }
      
      // If response is an array directly
      if (Array.isArray(response)) {
        console.log(`✅ Found ${response.length} housemaids (array format)`);
        return { housemaids: response, total: response.length };
      }
      
      // If response has data property
      if (response.data && Array.isArray(response.data)) {
        const housemaids = response.data;
        const total = response.total || response.count || housemaids.length;
        console.log(`✅ Found ${housemaids.length} housemaids (data property)`);
        return { housemaids, total };
      }
      
      console.warn('⚠️ Unexpected response format:', response);
      return rejectWithValue(response.message || 'تنسيق الاستجابة غير متوقع');
    } catch (error) {
      console.error('❌ Error fetching housemaids:', error);
      return rejectWithValue(error.message || 'حدث خطأ أثناء تحميل الاستقدام');
    }
  }
);

export const createHousemaid = createAsyncThunk(
  'housemaids/createHousemaid',
  async (housemaidData, { rejectWithValue }) => {
    try {
      console.log('📤 Sending housemaid data to API:', housemaidData);
      const response = await housemaidsAPI.create(housemaidData);
      console.log('📥 API Response:', response);
      if (response.success) {
        console.log('✅ Housemaid created successfully:', response.data);
        return response.data;
      }
      console.error('❌ API returned error:', response.message);
      return rejectWithValue(response.message || 'فشل إضافة المساعدة');
    } catch (error) {
      console.error('❌ Error creating housemaid:', error.message);
      return rejectWithValue(error.message || 'حدث خطأ أثناء إضافة المساعدة');
    }
  }
);

export const updateHousemaidById = createAsyncThunk(
  'housemaids/updateHousemaid',
  async ({ id, housemaidData }, { rejectWithValue }) => {
    try {
      const response = await housemaidsAPI.update(id, housemaidData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحديث المساعدة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء التحديث');
    }
  }
);

export const deleteHousemaidById = createAsyncThunk(
  'housemaids/deleteHousemaid',
  async (id, { rejectWithValue }) => {
    try {
      const response = await housemaidsAPI.delete(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'فشل حذف المساعدة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء الحذف');
    }
  }
);

const housemaidsSlice = createSlice({
  name: 'housemaids',
  initialState,
  reducers: {
    setCurrentHousemaid: (state, action) => {
      state.currentHousemaid = action.payload;
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
      // Fetch housemaids
      .addCase(fetchHousemaids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHousemaids.fulfilled, (state, action) => {
        state.loading = false;
        console.log('📦 Reducer received payload:', action.payload);
        const housemaids = action.payload?.housemaids || action.payload?.data || [];
        const total = action.payload?.total || action.payload?.count || housemaids.length;
        
        if (housemaids && housemaids.length > 0) {
          console.log(`✅ Setting ${housemaids.length} housemaids in state`);
          state.housemaids = housemaids;
          state.total = total;
        } else {
          console.warn('⚠️ No housemaids found in payload, clearing state');
          state.housemaids = [];
          state.total = 0;
        }
      })
      .addCase(fetchHousemaids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (state.housemaids.length === 0) {
          state.housemaids = [];
          state.total = 0;
        }
      })
      // Create housemaid
      .addCase(createHousemaid.fulfilled, (state, action) => {
        state.housemaids.unshift(action.payload);
        state.total += 1;
      })
      // Update housemaid
      .addCase(updateHousemaidById.fulfilled, (state, action) => {
        const index = state.housemaids.findIndex(h => h._id === action.payload._id);
        if (index !== -1) {
          state.housemaids[index] = action.payload;
        }
        if (state.currentHousemaid && state.currentHousemaid._id === action.payload._id) {
          state.currentHousemaid = action.payload;
        }
      })
      // Delete housemaid
      .addCase(deleteHousemaidById.fulfilled, (state, action) => {
        state.housemaids = state.housemaids.filter(h => h._id !== action.payload);
        state.total -= 1;
        if (state.currentHousemaid && state.currentHousemaid._id === action.payload) {
          state.currentHousemaid = null;
        }
      });
  },
});

export const { setCurrentHousemaid, setFilters, clearError } = housemaidsSlice.actions;
export default housemaidsSlice.reducer;

