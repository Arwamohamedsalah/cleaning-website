import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      console.log('🔐 Frontend: Attempting login with:', { username, passwordLength: password?.length });
      const response = await authAPI.login(username, password);
      console.log('🔐 Frontend: Login response:', { success: response.success, hasData: !!response.data, message: response.message });
      
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      const errorMessage = response.message || 'فشل تسجيل الدخول';
      console.log('❌ Frontend: Login failed:', errorMessage);
      return rejectWithValue(errorMessage);
    } catch (error) {
      console.error('❌ Frontend: Login error:', error);
      return rejectWithValue(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحميل بيانات المستخدم');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء تحميل البيانات');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحديث الملف الشخصي');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء التحديث');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
      authAPI.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

