import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workersAPI } from '../../services/api';

// Mock data مؤقت للعاملات والمساعدات
const mockWorkers = [
  // عاملات للوقت المحدد (hourly/daily)
  {
    _id: 'worker1',
    arabicName: 'سارة أحمد',
    englishName: 'Sara Ahmed',
    nationality: 'فلبينية',
    age: 28,
    phone: '0501234567',
    experience: 5,
    skills: ['تنظيف متقدم', 'تنظيف المطبخ', 'تنظيف الحمامات'],
    languages: ['عربي', 'إنجليزي', 'فلبيني'],
    contractType: 'hourly',
    status: 'available',
    totalOrders: 45,
    photos: [],
    isActive: true,
  },
  {
    _id: 'worker2',
    arabicName: 'مريم علي',
    englishName: 'Mariam Ali',
    nationality: 'إندونيسية',
    age: 32,
    phone: '0502345678',
    experience: 7,
    skills: ['تنظيف عادي', 'كوي', 'ترتيب'],
    languages: ['عربي', 'إنجليزي'],
    contractType: 'daily',
    status: 'available',
    totalOrders: 52,
    photos: [],
    isActive: true,
  },
  {
    _id: 'worker3',
    arabicName: 'فاطمة حسن',
    englishName: 'Fatima Hassan',
    nationality: 'سريلانكية',
    age: 26,
    phone: '0503456789',
    experience: 4,
    skills: ['تنظيف سريع', 'تنظيف النوافذ', 'تلميع'],
    languages: ['عربي', 'إنجليزي'],
    contractType: 'hourly',
    status: 'available',
    totalOrders: 38,
    photos: [],
    isActive: true,
  },
  {
    _id: 'worker4',
    arabicName: 'عائشة محمد',
    englishName: 'Aisha Mohammed',
    nationality: 'فلبينية',
    age: 30,
    phone: '0504567890',
    experience: 6,
    skills: ['تنظيف عميق', 'طبخ', 'أطفال'],
    languages: ['عربي', 'إنجليزي', 'فلبيني'],
    contractType: 'daily',
    status: 'busy',
    totalOrders: 41,
    photos: [],
    isActive: true,
  },
  // مساعدات بعقد (monthly/yearly)
  {
    _id: 'assistant1',
    arabicName: 'خديجة سالم',
    englishName: 'Khadija Salem',
    nationality: 'فلبينية',
    age: 35,
    phone: '0505678901',
    experience: 10,
    skills: ['تنظيف شامل', 'طبخ', 'كوي', 'أطفال', 'تنظيف متقدم'],
    languages: ['عربي', 'إنجليزي', 'فلبيني'],
    contractType: 'monthly',
    status: 'available',
    totalOrders: 120,
    photos: [],
    isActive: true,
  },
  {
    _id: 'assistant2',
    arabicName: 'نورا عبدالله',
    englishName: 'Nora Abdullah',
    nationality: 'إندونيسية',
    age: 33,
    phone: '0506789012',
    experience: 8,
    skills: ['تنظيف شامل', 'طبخ', 'ترتيب', 'تنظيف عميق'],
    languages: ['عربي', 'إنجليزي'],
    contractType: 'yearly',
    status: 'available',
    totalOrders: 95,
    photos: [],
    isActive: true,
  },
  {
    _id: 'assistant3',
    arabicName: 'ليلى أحمد',
    englishName: 'Layla Ahmed',
    nationality: 'سريلانكية',
    age: 29,
    phone: '0507890123',
    experience: 6,
    skills: ['تنظيف شامل', 'كوي', 'أطفال', 'تنظيف المطبخ'],
    languages: ['عربي', 'إنجليزي'],
    contractType: 'monthly',
    status: 'available',
    totalOrders: 78,
    photos: [],
    isActive: true,
  },
  {
    _id: 'assistant4',
    arabicName: 'زينب محمود',
    englishName: 'Zainab Mahmoud',
    nationality: 'فلبينية',
    age: 31,
    phone: '0508901234',
    experience: 9,
    skills: ['تنظيف شامل', 'طبخ', 'كوي', 'ترتيب', 'تنظيف عميق'],
    languages: ['عربي', 'إنجليزي', 'فلبيني'],
    contractType: 'yearly',
    status: 'busy',
    totalOrders: 110,
    photos: [],
    isActive: true,
  },
];

const initialState = {
  workers: [], // البيانات تأتي من الباك اند فقط
  currentWorker: null,
  loading: false,
  error: null,
  total: 0,
  filters: {
    nationality: 'all',
    status: 'all',
    skills: [],
  },
};

// Async thunks
export const fetchWorkers = createAsyncThunk(
  'workers/fetchWorkers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await workersAPI.getAll(params);
      if (response.success) {
        return { workers: response.data, total: response.total || 0 };
      }
      return rejectWithValue(response.message || 'فشل تحميل العاملات');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء تحميل العاملات');
    }
  }
);

export const createWorker = createAsyncThunk(
  'workers/createWorker',
  async (workerData, { rejectWithValue }) => {
    try {
      const response = await workersAPI.create(workerData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل إضافة العاملة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء إضافة العاملة');
    }
  }
);

export const updateWorkerById = createAsyncThunk(
  'workers/updateWorker',
  async ({ id, workerData }, { rejectWithValue }) => {
    try {
      const response = await workersAPI.update(id, workerData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحديث العاملة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء التحديث');
    }
  }
);

export const deleteWorkerById = createAsyncThunk(
  'workers/deleteWorker',
  async (id, { rejectWithValue }) => {
    try {
      const response = await workersAPI.delete(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'فشل حذف العاملة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء الحذف');
    }
  }
);

const workersSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    setCurrentWorker: (state, action) => {
      state.currentWorker = action.payload;
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
      // Fetch workers
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // البيانات تأتي من الباك اند فقط
        state.workers = action.payload.workers || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // في حالة فشل الاتصال، لا نستخدم mock data
        state.workers = [];
        state.total = 0;
      })
      // Create worker
      .addCase(createWorker.fulfilled, (state, action) => {
        state.workers.unshift(action.payload);
        state.total += 1;
      })
      // Update worker
      .addCase(updateWorkerById.fulfilled, (state, action) => {
        const index = state.workers.findIndex(worker => worker._id === action.payload._id);
        if (index !== -1) {
          state.workers[index] = action.payload;
        }
        if (state.currentWorker && state.currentWorker._id === action.payload._id) {
          state.currentWorker = action.payload;
        }
      })
      // Delete worker
      .addCase(deleteWorkerById.fulfilled, (state, action) => {
        state.workers = state.workers.filter(worker => worker._id !== action.payload);
        state.total -= 1;
        if (state.currentWorker && state.currentWorker._id === action.payload) {
          state.currentWorker = null;
        }
      });
  },
});

export const { setCurrentWorker, setFilters, clearError } = workersSlice.actions;
export default workersSlice.reducer;

