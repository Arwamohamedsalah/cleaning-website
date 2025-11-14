import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

console.log('🚀 Starting React App...');

// Apply sidebar width on initial load and set theme to light
const applyInitialSettings = () => {
  // Always use light theme
  document.documentElement.setAttribute('data-theme', 'light');
  
  const savedSidebarWidth = localStorage.getItem('sidebarWidth') || '280';
  document.documentElement.style.setProperty('--sidebar-width', `${savedSidebarWidth}px`);
};

applyInitialSettings();

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('✅ React App rendered');
}

