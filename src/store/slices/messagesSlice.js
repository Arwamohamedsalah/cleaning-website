import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagesAPI } from '../../services/api';

const initialState = {
  messages: [],
  currentMessage: null,
  loading: false,
  error: null,
  total: 0,
  filters: {
    status: 'all',
    subject: 'all',
  },
};

// Async thunks
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.getAll(params);
      if (response.success) {
        return { messages: response.data, total: response.total || 0 };
      }
      return rejectWithValue(response.message || 'فشل تحميل الرسائل');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء تحميل الرسائل');
    }
  }
);

export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.create(messageData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل إرسال الرسالة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء إرسال الرسالة');
    }
  }
);

export const updateMessageById = createAsyncThunk(
  'messages/updateMessage',
  async ({ id, messageData }, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.update(id, messageData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل تحديث الرسالة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء التحديث');
    }
  }
);

export const replyToMessage = createAsyncThunk(
  'messages/replyMessage',
  async ({ id, replyMessage }, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.reply(id, replyMessage);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'فشل إرسال الرد');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء إرسال الرد');
    }
  }
);

export const deleteMessageById = createAsyncThunk(
  'messages/deleteMessage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.delete(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'فشل حذف الرسالة');
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء الحذف');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
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
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.total = action.payload.total;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create message
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update message
      .addCase(updateMessageById.fulfilled, (state, action) => {
        const index = state.messages.findIndex(msg => msg._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      // Reply message
      .addCase(replyToMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(msg => msg._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      // Delete message
      .addCase(deleteMessageById.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setCurrentMessage, setFilters, clearError } = messagesSlice.actions;
export default messagesSlice.reducer;

