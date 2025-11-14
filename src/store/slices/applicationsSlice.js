import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsAPI } from '../../services/api';

const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  total: 0,
  filters: {
    status: 'all',
    nationality: 'all',
    ageRange: null,
    experience: null,
  },
};

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.getAll(params);
      if (response.success) {
        return { applications: response.data, total: response.total || 0 };
      }
      return rejectWithValue(response.message || 'فشل تحميل طلبات التوظيف');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء تحميل طلبات التوظيف');
    }
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.create(applicationData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل إرسال طلب التوظيف');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء إرسال طلب التوظيف');
    }
  }
);

export const updateApplicationById = createAsyncThunk(
  'applications/updateApplication',
  async ({ id, applicationData }, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.update(id, applicationData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحديث طلب التوظيف');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء التحديث');
    }
  }
);

export const acceptApplicationById = createAsyncThunk(
  'applications/acceptApplication',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.accept(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل قبول الطلبية');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء قبول الطلبية');
    }
  }
);

export const rejectApplicationById = createAsyncThunk(
  'applications/rejectApplication',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.reject(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل رفض الطلبية');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء رفض الطلبية');
    }
  }
);

export const deleteApplicationById = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.delete(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'فشل حذف الطلب');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء الحذف');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload;
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
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
        state.total = action.payload.total;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update application
      .addCase(updateApplicationById.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      // Accept application
      .addCase(acceptApplicationById.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload.application._id);
        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
      })
      // Reject application
      .addCase(rejectApplicationById.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      // Delete application
      .addCase(deleteApplicationById.fulfilled, (state, action) => {
        state.applications = state.applications.filter(app => app._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setCurrentApplication, setFilters, clearError } = applicationsSlice.actions;
export default applicationsSlice.reducer;

