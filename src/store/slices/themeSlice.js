import { createSlice } from '@reduxjs/toolkit';

// Get sidebar width from localStorage or default to 280
const getInitialSidebarWidth = () => {
  const savedWidth = localStorage.getItem('sidebarWidth');
  if (savedWidth) {
    return parseInt(savedWidth, 10);
  }
  return 280; // Default width
};

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarWidth: getInitialSidebarWidth(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      // Apply theme to document root
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload;
      localStorage.setItem('sidebarWidth', action.payload.toString());
      // Apply width to document root as CSS variable
      document.documentElement.style.setProperty('--sidebar-width', `${action.payload}px`);
    },
  },
});

export const { setTheme, setSidebarWidth } = themeSlice.actions;
export default themeSlice.reducer;

